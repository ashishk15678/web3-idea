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

#[get("/ideas")]
pub async fn list_ideas() -> impl Responder {
    HttpResponse::Ok().json(vec!["Mock Idea 1", "Mock Idea 2"])
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

#[post("/ideas")]
pub async fn create_idea() -> impl Responder {
    HttpResponse::Created().json("Mock idea created")
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
