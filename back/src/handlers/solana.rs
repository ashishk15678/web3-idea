// This is a mock handler for Solana interaction logic
pub fn mock_solana_interaction() -> &'static str {
    "Mock Solana interaction"
}

use crate::utils;
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{read_keypair_file, Keypair};
use solana_sdk::signer::{EncodableKey, Signer};
use solana_sdk::system_instruction;
use solana_sdk::system_program;
use solana_sdk::transaction::Transaction;
use std::env;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use std::str::FromStr;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::Mutex;
use tokio::task::JoinHandle;

const KEYPAIR_PATH: &str = "solana-keypair.json";
const MIN_REQUIRED_SOL: u64 = 1_000_000; // 0.001 SOL in lamports

/// Configuration for the Solana thread
#[derive(Clone)]
pub struct SolanaThreadConfig {
    pub block_interval_secs: u64,
    pub rpc_url: String,
}

impl Default for SolanaThreadConfig {
    fn default() -> Self {
        Self {
            block_interval_secs: 30,
            rpc_url: env::var("SOLANA_RPC_URL")
                .unwrap_or_else(|_| "https://api.devnet.solana.com".to_string()),
        }
    }
}

/// A thread-safe wrapper for Solana operations
pub struct SolanaThread {
    handle: Arc<Mutex<Option<JoinHandle<()>>>>,
    is_running: Arc<Mutex<bool>>,
    config: Arc<Mutex<SolanaThreadConfig>>,
    last_block_signature: Arc<Mutex<Option<String>>>,
}

impl SolanaThread {
    pub fn new() -> Self {
        Self {
            handle: Arc::new(Mutex::new(None)),
            is_running: Arc::new(Mutex::new(false)),
            config: Arc::new(Mutex::new(SolanaThreadConfig::default())),
            last_block_signature: Arc::new(Mutex::new(None)),
        }
    }

    /// Creates a new SolanaThread with custom configuration
    pub fn with_config(config: SolanaThreadConfig) -> Self {
        Self {
            handle: Arc::new(Mutex::new(None)),
            is_running: Arc::new(Mutex::new(false)),
            config: Arc::new(Mutex::new(config)),
            last_block_signature: Arc::new(Mutex::new(None)),
        }
    }

    /// Updates the block creation interval
    pub async fn set_block_interval(&self, seconds: u64) {
        let mut config = self.config.lock().await;
        config.block_interval_secs = seconds;
        utils::log(&format!(
            "[Solana Thread] Block interval updated to {} seconds",
            seconds
        ));
    }

    /// Gets the current block creation interval
    pub async fn get_block_interval(&self) -> u64 {
        let config = self.config.lock().await;
        config.block_interval_secs
    }

    /// Gets the signature of the last created block
    pub async fn get_last_block_signature(&self) -> Option<String> {
        let signature = self.last_block_signature.lock().await;
        signature.clone()
    }

    /// Manually triggers a block creation
    pub async fn create_block_now(&self) -> Result<String, String> {
        let config = self.config.lock().await;
        match create_block_on_devnet_with_url(&config.rpc_url).await {
            Ok(signature) => {
                let mut last_sig = self.last_block_signature.lock().await;
                *last_sig = Some(signature.clone());
                Ok(signature)
            }
            Err(e) => Err(e),
        }
    }

    /// Starts the Solana thread if it's not already running
    pub async fn start(&self) -> Result<(), String> {
        let mut is_running = self.is_running.lock().await;
        if *is_running {
            return Ok(());
        }

        let is_running_clone = self.is_running.clone();
        let config_clone = self.config.clone();
        let last_block_signature_clone = self.last_block_signature.clone();

        // Spawn a new thread for Solana operations
        let handle = tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(30)); // Initial interval

            loop {
                // Check if we should stop
                {
                    let running = is_running_clone.lock().await;
                    if !*running {
                        break;
                    }
                }

                // Get current config
                let config = config_clone.lock().await;
                let rpc_url = config.rpc_url.clone();
                let interval_secs = config.block_interval_secs;
                drop(config); // Release the lock

                // Update interval if needed
                interval = tokio::time::interval(Duration::from_secs(interval_secs));

                // Create a block
                match create_block_on_devnet_with_url(&rpc_url).await {
                    Ok(signature) => {
                        let mut last_sig = last_block_signature_clone.lock().await;
                        *last_sig = Some(signature.clone());
                        utils::log(&format!(
                            "[Solana Thread] Created block with signature: {:?}",
                            signature
                        ));
                    }
                    Err(e) => {
                        utils::log(&format!("[Solana Thread] Error creating block: {}", e));
                    }
                }

                // Wait for the next interval
                interval.tick().await;
            }
        });

        // Store the handle and update running state
        *self.handle.lock().await = Some(handle);
        *is_running = true;

        utils::log("[Solana Thread] Started successfully");
        Ok(())
    }

    /// Stops the Solana thread if it's running
    pub async fn stop(&self) -> Result<(), String> {
        let mut is_running = self.is_running.lock().await;
        if !*is_running {
            return Ok(());
        }

        // Signal the thread to stop
        *is_running = false;

        // Wait for the thread to finish
        if let Some(handle) = self.handle.lock().await.take() {
            if let Err(e) = handle.await {
                return Err(format!("Error stopping Solana thread: {}", e));
            }
        }

        utils::log("[Solana Thread] Stopped successfully");
        Ok(())
    }

    /// Checks if the Solana thread is currently running
    pub async fn is_running(&self) -> bool {
        *self.is_running.lock().await
    }
}

/// Gets the persistent keypair, creating it if it doesn't exist
fn get_persistent_keypair() -> Result<Keypair, String> {
    let keypair_path = Path::new(KEYPAIR_PATH);

    if keypair_path.exists() {
        // Load existing keypair
        match read_keypair_file(keypair_path) {
            Ok(keypair) => {
                utils::log(&format!(
                    "[Solana] Loaded existing keypair: {}",
                    keypair.pubkey()
                ));
                Ok(keypair)
            }
            Err(e) => Err(format!("Failed to read keypair: {}", e)),
        }
    } else {
        // Create and save new keypair
        let keypair = Keypair::new();
        let pubkey = keypair.pubkey();

        // Save the keypair
        if let Err(e) = keypair.write_to_file(keypair_path) {
            return Err(format!("Failed to save keypair: {}", e));
        }

        utils::log(&format!("[Solana] Created new keypair: {}", pubkey));
        utils::log("[Solana] Please airdrop 1 SOL to this address using: solana airdrop 1 <PUBKEY> --url devnet");

        Ok(keypair)
    }
}

/// Ensures the account has enough SOL, requesting airdrop if needed
async fn ensure_account_funded(rpc_client: &RpcClient, pubkey: &Pubkey) -> Result<(), String> {
    // Check current balance
    match rpc_client.get_balance(pubkey) {
        Ok(balance) => {
            if balance >= MIN_REQUIRED_SOL {
                utils::log(&format!(
                    "[Solana] Account has sufficient balance: {} lamports",
                    balance
                ));
                return Ok(());
            }
            utils::log(&format!(
                "[Solana] Account balance low ({} lamports), requesting airdrop",
                balance
            ));
        }
        Err(e) => {
            utils::log(&format!("[Solana] Failed to get balance: {}", e));
        }
    }

    // Request airdrop
    match rpc_client.request_airdrop(pubkey, MIN_REQUIRED_SOL) {
        Ok(signature) => {
            utils::log(&format!(
                "[Solana] Airdrop requested, signature: {}",
                signature
            ));
            // Wait for confirmation
            match rpc_client.confirm_transaction(&signature) {
                Ok(_) => {
                    utils::log("[Solana] Airdrop confirmed");
                    Ok(())
                }
                Err(e) => Err(format!("Airdrop confirmation failed: {}", e)),
            }
        }
        Err(e) => Err(format!("Airdrop request failed: {}", e)),
    }
}

/// Creates a block on Solana devnet with a specific RPC URL
async fn create_block_on_devnet_with_url(rpc_url: &str) -> Result<String, String> {
    let rpc_client = RpcClient::new(rpc_url.to_string());

    // Use the target pubkey
    let target_pubkey = Pubkey::from_str("Hv9Zkh34KashoQLU9MtHMFjXq1uja8iDwK9jM7NUuv2L")
        .map_err(|e| format!("Invalid pubkey: {}", e))?;

    // Get our persistent keypair
    let keypair = get_persistent_keypair()?;
    let pubkey = keypair.pubkey();

    // Ensure account has enough SOL
    ensure_account_funded(&rpc_client, &pubkey).await?;

    // Get recent blockhash
    let recent_blockhash = rpc_client
        .get_latest_blockhash()
        .map_err(|e| format!("Failed to get recent blockhash: {}", e))?;

    // Create transfer instruction to the target pubkey
    let transfer_ix = system_instruction::transfer(
        &pubkey,
        &target_pubkey,
        100_000, // Transfer 0.0001 SOL
    );

    // Build and sign the transaction
    let transaction = Transaction::new_signed_with_payer(
        &[transfer_ix],
        Some(&pubkey),
        &[&keypair],
        recent_blockhash,
    );

    // Send and confirm the transaction
    match rpc_client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            utils::log(&format!(
                "[Solana] Created block with signature: {}",
                signature
            ));
            Ok(signature.to_string())
        }
        Err(e) => {
            let err_msg = format!("Failed to create block: {}", e);
            utils::log(&err_msg);
            Err(err_msg)
        }
    }
}

/// Creates a new block on Solana devnet by sending a dummy transaction.
/// This is useful for testing and ensuring the connection to devnet is working.
///
/// # Returns
/// * `Result<(), String>` - Ok(()) if successful, Err with error message if failed
///
/// # Example
/// ```
/// let result = create_block_on_devnet().await;
/// match result {
///     Ok(_) => println!("Block created successfully"),
///     Err(e) => println!("Failed to create block: {}", e),
/// }
/// ```
pub async fn create_block_on_devnet() -> Result<(), String> {
    // Get RPC URL from environment variable or use default
    let rpc_url =
        env::var("SOLANA_RPC_URL").unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());

    utils::log(&format!("[Solana] Connecting to devnet at {}", rpc_url));

    // Initialize RPC client
    let rpc_client = RpcClient::new(rpc_url);

    // Generate a new keypair for testing
    let dummy_keypair = Keypair::new();
    let dummy_pubkey = dummy_keypair.pubkey();
    utils::log(&format!("[Solana] Using test keypair: {}", dummy_pubkey));

    // Use system program as recipient for the dummy transaction
    let recipient_pubkey = system_program::id();
    utils::log(&format!("[Solana] Recipient pubkey: {}", recipient_pubkey));

    // Get the latest blockhash
    let recent_blockhash = match rpc_client.get_latest_blockhash() {
        Ok(hash) => {
            utils::log(&format!("[Solana] Got recent blockhash: {}", hash));
            hash
        }
        Err(e) => {
            let err_msg = format!("[Solana] Failed to get recent blockhash: {}", e);
            utils::log(&err_msg);
            return Err(err_msg);
        }
    };

    // Create a dummy transfer instruction (0 lamports)
    let transfer_ix = system_instruction::transfer(&dummy_pubkey, &recipient_pubkey, 0);

    // Build and sign the transaction
    let transaction = Transaction::new_signed_with_payer(
        &[transfer_ix],
        Some(&dummy_pubkey),
        &[&dummy_keypair],
        recent_blockhash,
    );

    // Send and confirm the transaction
    match rpc_client.send_and_confirm_transaction(&transaction) {
        Ok(signature) => {
            let success_msg = format!(
                "[Solana] Successfully created block! Transaction signature: {}",
                signature
            );
            utils::log(&success_msg);
            Ok(())
        }
        Err(e) => {
            let err_msg = format!("[Solana] Failed to create block: {}", e);
            utils::log(&err_msg);
            Err(err_msg)
        }
    }
}

/// Example usage of how to start and stop the Solana thread
pub async fn start_solana_thread() -> Result<SolanaThread, String> {
    let solana_thread = SolanaThread::new();
    solana_thread.start().await?;
    Ok(solana_thread)
}

/// Example of how to use the Solana thread with custom configuration
pub async fn start_solana_thread_with_config(
    config: SolanaThreadConfig,
) -> Result<SolanaThread, String> {
    let solana_thread = SolanaThread::with_config(config);
    solana_thread.start().await?;
    Ok(solana_thread)
}

// Example usage:
/*
async fn example_usage() {
    // Start with default configuration (30 second intervals)
    let solana_thread = start_solana_thread().await?;

    // Or start with custom configuration
    let config = SolanaThreadConfig {
        block_interval_secs: 60, // Create blocks every minute
        rpc_url: "https://api.devnet.solana.com".to_string(),
    };
    let solana_thread = start_solana_thread_with_config(config).await?;

    // Get the last block signature
    if let Some(signature) = solana_thread.get_last_block_signature().await {
        println!("Last block signature: {}", signature);
    }

    // Change the block interval
    solana_thread.set_block_interval(45).await; // Change to 45 seconds

    // Manually create a block
    match solana_thread.create_block_now().await {
        Ok(signature) => println!("Created block with signature: {}", signature),
        Err(e) => println!("Failed to create block: {}", e),
    }

    // Stop the thread when done
    solana_thread.stop().await?;
}
*/
