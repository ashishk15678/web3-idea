use actix_web::{get, post, web, HttpResponse, Responder};

// #[post("/ideas/{id}/vote")]
// pub async fn vote_on_idea(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock vote on idea {}", id))
// }

// #[get("/ideas/{id}/votes")]
// pub async fn get_votes(web::Path(id): web::Path<u32>) -> impl Responder {
//     HttpResponse::Ok().json(format!("Mock votes for idea {}", id))
// }

// pub fn config(cfg: &mut web::ServiceConfig) {
//     cfg.service(vote_on_idea).service(get_votes);
// }
