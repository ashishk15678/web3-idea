use actix_web::{App, HttpServer, web};

mod controllers;
mod services;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // It's good practice to initialize services that might be shared, like SolanaService
    // let solana_service = web::Data::new(services::solana_service::SolanaService::new());

    HttpServer::new(move || { // Add move here if using solana_service
        App::new()
            // .app_data(solana_service.clone()) // Share SolanaService with handlers
            .service(controllers::health_controller::health_check)
            .configure(controllers::market_controller::config) // Configure market routes
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
