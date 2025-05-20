use actix_web::{get, post, web, HttpResponse, Responder};

use crate::db::{self, Idea};

// #[post("/ideas/{id}/stake")]
// pub async fn stake_on_idea(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock stake on idea {}", id))
// }

// #[get("/ideas/{id}/stakes")]
// pub async fn get_stakes(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock stakes for idea {}", id))
// }

// pub fn config(cfg: &mut web::ServiceConfig) {
//     cfg.service(stake_on_idea).service(get_stakes);
// }

#[derive(serde::Deserialize)]
struct CreateIdeaRequest {
    title: String,
    description: String,
    creator_id: String,
    category: String,
    initial_price: f64,
    target_price: f64,
    timeframe: String,
    risk_level: i32,
    market_size: String,
    competitive_advantage: String,
}

#[post("/ideas/create")]
pub async fn create_idea(payload: web::Json<CreateIdeaRequest>) -> impl Responder {
    let idea = db::Idea {
        id: None,
        title: payload.title.clone(),
        description: payload.description.clone(),
        creator_id: payload.creator_id.clone(),
        category: payload.category.clone(),
        initial_price: payload.initial_price,
        target_price: payload.target_price,
        timeframe: payload.timeframe.clone(),
        risk_level: payload.risk_level,
        market_size: payload.market_size.clone(),
        competitive_advantage: payload.competitive_advantage.clone(),
        status: "active".to_string(),
        resolution_outcome: None,
        created_at: None,
        updated_at: None,
        resolved_at: None,
    };

    match db::createIdea(idea).await {
        Ok(created_idea) => HttpResponse::Created().json(created_idea),
        Err(e) => match e {
            db::DbError::ValidationError(msg) => HttpResponse::BadRequest().json(msg),
            _ => HttpResponse::InternalServerError().json(e.to_string()),
        },
    }
}

// #[post("/ideas/{id}/trade")]
// pub async fn trade_idea(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock trade idea {}", id))
// }

#[get("/ideas")]
pub async fn get_all_ideas() -> impl Responder {
    let ideas = db::getAllIdeas().await.unwrap();
    HttpResponse::Ok().json(ideas)
}
