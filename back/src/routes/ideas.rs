use crate::db::User;
use crate::db::{self, DbError};
use crate::utils;
use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreateUserRequest {
    pub wallet_address: String,
    pub username: String,
}

#[derive(Deserialize)]
pub struct CreateIdeaRequest {
    pub title: String,
    pub description: String,
    pub image_url: String,
    pub category: String,
    pub initial_price: f64,
    pub target_price: f64,
    pub timeframe: String,
    pub risk_level: i32,
    pub market_size: String,
    pub competitive_advantage: String,
}

#[post("/ideas")]
pub async fn create_idea(payload: web::Json<CreateIdeaRequest>) -> impl Responder {
    let idea = db::Idea::new(
        payload.title.clone(),
        payload.description.clone(),
        payload.image_url.clone(),
        payload.category.clone(),
        payload.initial_price,
        payload.target_price,
        payload.timeframe.clone(),
        payload.risk_level,
        payload.market_size.clone(),
        payload.competitive_advantage.clone(),
    );
    match db::createIdea(idea).await {
        Ok(idea) => HttpResponse::Created().json(web::Json(idea)),
        Err(DbError::ConnectionError(e)) => HttpResponse::ServiceUnavailable().json(e),
        Err(e) => HttpResponse::InternalServerError().json(e.to_string()),
    }
}

#[get("/ideas")]
pub async fn list_ideas() -> impl Responder {
    HttpResponse::Ok().json(vec!["Mock Idea 1", "Mock Idea 2"])
}

#[get("/ideas/{id}")]
pub async fn get_idea(id: web::Path<u32>) -> impl Responder {
    HttpResponse::Ok().json(format!("Mock idea {}", id))
}

#[post("/user")]
async fn create_user(payload: web::Json<CreateUserRequest>) -> impl Responder {
    utils::route_log(
        "POST",
        "/user",
        Some(&format!("wallet: {}", payload.wallet_address)),
    );
    let user = User::new(payload.username.clone(), payload.wallet_address.clone());
    match db::createUser(user).await {
        Ok(user) => HttpResponse::Created().json(web::Json(user)),
        Err(DbError::ValidationError(e)) => HttpResponse::BadRequest().json(e),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/users")]
pub async fn list_users() -> impl Responder {
    utils::route_log("GET", "/users", None);
    match db::getAllUsers().await {
        Ok(users) => HttpResponse::Ok().json(web::Json(users)),
        Err(DbError::ConnectionError(e)) => HttpResponse::ServiceUnavailable().json(e),
        Err(e) => HttpResponse::InternalServerError().json(e.to_string()),
    }
}

#[get("/user/{wallet_address}")]
pub async fn get_user_by_wallet_address(wallet_address: web::Path<String>) -> impl Responder {
    utils::route_log("GET", "/user/{wallet_address}", Some(&wallet_address));
    match db::getUserByWalletAddress(wallet_address.into_inner()).await {
        Ok(user) => HttpResponse::Ok().json(web::Json(user)),
        Err(DbError::NotFound(e)) => HttpResponse::NotFound().json(e),
        Err(DbError::ValidationError(e)) => HttpResponse::BadRequest().json(e),
        Err(DbError::ConnectionError(e)) => HttpResponse::ServiceUnavailable().json(e),
        Err(e) => HttpResponse::InternalServerError().json(e.to_string()),
    }
}

// #[put("/ideas/{id}")]
// pub async fn update_idea(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock idea {} updated", id))
// }

// #[delete("/ideas/{id}")]
// pub async fn delete_idea(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock idea {} deleted", id))
// }

// pub fn config(cfg: &mut web::ServiceConfig) {
//     cfg.service(list_ideas)
//         .service(create_idea)
//         .service(update_idea)
//         .service(delete_idea);
// }
