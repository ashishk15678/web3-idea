use crate::utils;
use actix_web::{get, HttpResponse, Responder};

#[get("/health")]
async fn health_check() -> impl Responder {
    utils::route_log("GET", "/health", None);
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now()
    }))
}

#[get("/")]
async fn index() -> impl Responder {
    utils::route_log("GET", "/", None);
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Idea Market API",
        "version": "1.0.0"
    }))
}
