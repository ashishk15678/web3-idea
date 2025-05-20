use actix_web::{web, get, post, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use serde_json;

// We will likely need to use the SolanaService here
// use crate::services::solana_service::SolanaService;

// --- Request Structs ---
#[derive(Deserialize, Debug)]
pub struct CreateMarketPayload {
   event_name: String,
   // Example: ["Yes", "No"] or ["Team A wins", "Team B wins"]
   outcomes: Vec<String>,
   // You might add other details like market end time, resolution source, etc.
   //  oracle_pubkey: Option<String>, 
   //  end_timestamp: Option<i64>,
}

#[derive(Deserialize, Debug)]
pub struct PlaceBetPayload {
   outcome_index: u8, // Index into the market's outcomes array
   amount: u64,         // Amount of tokens to bet (smallest unit, e.g., lamports)
   user_pubkey: String, // Public key of the user placing the bet (for now, later could be from auth)
}

// --- Response Structs ---
#[derive(Serialize, Debug)]
pub struct MarketResponse {
    id: String, // This would be an on-chain account address or unique ID
    event_name: String,
    outcomes: Vec<String>,
    is_open: bool, // Is the market currently accepting bets?
    //  resolved_outcome: Option<u8>,
    //  total_pot: u64,
}

// --- Controller Actions ---

// GET /markets - List all markets
#[get("/markets")]
async fn list_markets(/*solana_service: web::Data<SolanaService>*/) -> impl Responder {
    // TODO: Call solana_service to get a list of markets from the blockchain
    // For now, returning dummy data
    let dummy_markets = vec![
        MarketResponse {
            id: "market1_pubkey_placeholder".to_string(),
            event_name: "Will it rain tomorrow?".to_string(),
            outcomes: vec!["Yes".to_string(), "No".to_string()],
            is_open: true,
        },
        MarketResponse {
            id: "market2_pubkey_placeholder".to_string(),
            event_name: "Who wins the next match?".to_string(),
            outcomes: vec!["Team A".to_string(), "Team B".to_string(), "Draw".to_string()],
            is_open: false, // Example of a closed market
        }
    ];
    HttpResponse::Ok().json(dummy_markets)
}

// POST /markets - Create a new market
#[post("/markets")]
async fn create_market(
    payload: web::Json<CreateMarketPayload>,
    // solana_service: web::Data<SolanaService>
) -> impl Responder {
    // TODO: Validate payload (e.g., at least 2 outcomes)
    // TODO: Call solana_service to create the market on-chain
    // The solana_service would return the new market's ID (e.g., program account pubkey)
    
    println!("Received create market payload: {:?}", payload);

    let new_market_id = "new_market_id_placeholder".to_string(); // Get from solana_service

    HttpResponse::Created().json(MarketResponse {
        id: new_market_id,
        event_name: payload.event_name.clone(),
        outcomes: payload.outcomes.clone(),
        is_open: true, // New markets are typically open
    })
}

// GET /markets/{market_id} - Get details for a specific market
#[get("/markets/{market_id}")]
async fn get_market_details(
    market_id: web::Path<String>,
    // solana_service: web::Data<SolanaService>
) -> impl Responder {
    // TODO: Call solana_service to get market details for market_id.as_str()
    println!("Fetching details for market: {}", market_id);

    // Dummy data for a specific market
    let market_details = MarketResponse {
        id: market_id.into_inner(),
        event_name: "Specific Market Event".to_string(),
        outcomes: vec!["Outcome A".to_string(), "Outcome B".to_string()],
        is_open: true,
    };
    HttpResponse::Ok().json(market_details)
}


#[post("/markets/{market_id}/bet")]
async fn place_bet(
    market_id: web::Path<String>,
    payload: web::Json<PlaceBetPayload>,
    // solana_service: web::Data<SolanaService>
) -> impl Responder {
    // TODO: Validate payload (e.g., outcome_index is valid for the market)
    // TODO: Ensure market is open for betting via solana_service
    // TODO: Construct transaction for user to sign, or interact with solana_service to place the bet
    println!(
        "Placing bet on market {}: {:?}",
        market_id.as_str(),
        payload
    );
    // Dummy response
    HttpResponse::Ok().json(serde_json::json!({
        "status": "success",
        "market_id": market_id.as_str(),
        "outcome_index": payload.outcome_index,
        "amount": payload.amount,
        "transaction_signature_placeholder": "dummy_tx_sig_goes_here"
    }))
}

// Function to configure routes for this controller
// ... existing code ...