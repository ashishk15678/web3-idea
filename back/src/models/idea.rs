use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Idea {
    pub id: u32,
    pub title: String,
    pub description: String,
} 