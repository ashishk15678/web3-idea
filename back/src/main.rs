use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use handlers::solana::{start_solana_thread, SolanaThreadConfig};
use std::sync::Arc;
use std::time::Duration;
use tokio::runtime::{Builder, Runtime};
use tokio::signal;
mod config;
mod controllers;
mod db;
mod handlers;
mod routes;
mod services;
mod utils;
// Remove the actix_web::main attribute and implement our own main
fn main() -> std::io::Result<()> {
    // Create a multi-threaded runtime
    let runtime: Runtime = Builder::new_multi_thread()
        .worker_threads(4) // Adjust based on your needs
        .enable_all() // Enable both IO and time features
        .build()
        .expect("Failed to create Tokio runtime");

    // Run the async main function in the runtime
    runtime.block_on(async_main())
}

async fn async_main() -> std::io::Result<()> {
    // Initialize logging
    utils::log("[Starting application]");

    // Get configuration
    let config = &config::CONFIG;
    let cors_origins = config.get_cors_origins();

    utils::log(&format!("[CORS] Allowed origins: {:?}", cors_origins));

    // Checking for DB connection
    match db::get_pool() {
        Ok(pool) => {
            // Try to get a client and ping the DB
            match pool.get().await {
                Ok(client) => {
                    // Optionally, run a simple query to verify
                    if let Err(e) = client.simple_query("SELECT 1").await {
                        utils::log(&format!("DB ping failed: {}", e));
                        return Err(std::io::Error::new(
                            std::io::ErrorKind::Other,
                            "DB ping failed",
                        ));
                    }
                    utils::log("[DB connected]");
                    pool
                }
                Err(e) => {
                    utils::log(&format!("Pool connection failed: {}", e));
                    return Err(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        "Pool connection failed",
                    ));
                }
            }
        }
        Err(e) => {
            utils::log(&format!("Pool creation failed: {}", e));
            return Err(std::io::Error::new(
                std::io::ErrorKind::Other,
                "Pool creation failed",
            ));
        }
    };

    // let solana_thread = match start_solana_thread().await {
    //     Ok(thread) => {
    //         utils::log("[Solana thread started successfully]");
    //         Arc::new(thread)
    //     }
    //     Err(e) => {
    //         utils::log(&format!("Solana thread creation failed: {}", e));
    //         return Err(std::io::Error::new(
    //             std::io::ErrorKind::Other,
    //             "Solana thread creation failed",
    //         ));
    //     }
    // };

    // // Clone the Arc for the server
    // let solana_thread_clone = solana_thread.clone();

    // Start the HTTP server
    let server = HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::permissive() // This enables all CORS settings for development
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .service(controllers::health_controller::health_check)
            .service(controllers::health_controller::index)
            .service(routes::ideas::create_user)
            .service(routes::ideas::list_users)
            .service(routes::ideas::get_user_by_wallet_address)
            .service(routes::staking::create_idea)
            .service(routes::staking::get_all_ideas)
        // .configure(controllers::market_controller::config)
    })
    .bind((config.server_host.as_str(), config.server_port))?
    .shutdown_timeout(30) // Set shutdown timeout to 30 seconds
    .run();

    // Handle graceful shutdown
    let server_handle = server.handle();
    let shutdown_signal = async {
        match signal::ctrl_c().await {
            Ok(()) => {
                utils::log("[Shutdown signal received]");
            }
            Err(err) => {
                utils::log(&format!("Error listening for shutdown signal: {}", err));
            }
        }
    };

    // Wait for either the server to complete or the shutdown signal
    tokio::select! {
        _ = server => {
            utils::log("[Server stopped]");
        }
        _ = shutdown_signal => {
            utils::log("[Initiating graceful shutdown]");

            // Stop the Solana thread first
            // if let Err(e) = solana_thread.stop().await {
            //     utils::log(&format!("Error stopping Solana thread: {}", e));
            // }


            // Stop the server
            server_handle.stop(true).await;

            utils::log("[Shutdown complete]");
            std::process::exit(0); // Force exit after shutdown
        }
    }

    Ok(())
}
