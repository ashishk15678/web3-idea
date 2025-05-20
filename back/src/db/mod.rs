use chrono::{DateTime, TimeZone, Utc};
use deadpool_postgres::{Client, Config, Pool, Runtime};
use serde::{Deserialize, Serialize};
use tokio_postgres::NoTls;

pub type PgPool = Pool;

// Custom error type for better error handling
#[derive(Debug)]
pub enum DbError {
    ConnectionError(String),
    QueryError(String),
    NotFound(String),
    ValidationError(String),
}

impl std::fmt::Display for DbError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DbError::ConnectionError(e) => write!(f, "Database connection error: {}", e),
            DbError::QueryError(e) => write!(f, "Database query error: {}", e),
            DbError::NotFound(e) => write!(f, "Record not found: {}", e),
            DbError::ValidationError(e) => write!(f, "Validation error: {}", e),
        }
    }
}

impl From<deadpool_postgres::PoolError> for DbError {
    fn from(err: deadpool_postgres::PoolError) -> Self {
        DbError::ConnectionError(err.to_string())
    }
}

impl From<tokio_postgres::Error> for DbError {
    fn from(err: tokio_postgres::Error) -> Self {
        DbError::QueryError(err.to_string())
    }
}

impl From<deadpool_postgres::CreatePoolError> for DbError {
    fn from(err: deadpool_postgres::CreatePoolError) -> Self {
        DbError::ConnectionError(err.to_string())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    id: Option<String>,
    username: String,
    wallet_address: String,
    created_at: Option<DateTime<Utc>>,
}

impl User {
    pub fn new(username: String, wallet_address: String) -> Self {
        Self {
            id: None,
            username,
            wallet_address,
            created_at: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Idea {
    pub id: Option<String>,
    pub title: String,
    pub description: String,
    pub creator_id: String,
    pub category: String,
    pub initial_price: f64,
    pub target_price: f64,
    pub timeframe: String,
    pub risk_level: i32,
    pub market_size: String,
    pub competitive_advantage: String,
    pub status: String,
    pub resolution_outcome: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub resolved_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Rate {
    id: Option<String>,
    idea_id: String,
    rate: f64,
    volume: f64,
    created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
    id: Option<String>,
    idea_id: String,
    buyer_id: String,
    seller_id: String,
    amount: f64,
    rate: f64,
    total_value: f64,
    status: String,
    created_at: Option<DateTime<Utc>>,
    updated_at: Option<DateTime<Utc>>,
    completed_at: Option<DateTime<Utc>>,
}

// Helper function to parse timestamp from database
fn parse_timestamp(row: &tokio_postgres::Row, column: &str) -> Option<DateTime<Utc>> {
    row.get::<_, Option<String>>(column)
        .and_then(|ts| Utc.datetime_from_str(&ts, "%Y-%m-%d %H:%M:%S%.f%z").ok())
}

pub fn get_pool() -> Result<PgPool, DbError> {
    let mut cfg = Config::new();
    cfg.host = Some("localhost".to_string());
    cfg.port = Some(5432);
    cfg.user = Some("postgres".to_string());
    cfg.password = Some("postgres".to_string());
    cfg.dbname = Some("postgres".to_string());
    cfg.manager = Some(deadpool_postgres::ManagerConfig {
        recycling_method: deadpool_postgres::RecyclingMethod::Fast,
    });
    cfg.create_pool(Some(Runtime::Tokio1), NoTls)
        .map_err(|e| DbError::ConnectionError(e.to_string()))
}

pub async fn getGlobalClient() -> Result<Client, DbError> {
    let pool = get_pool()?;
    let client = pool.get().await?;
    Ok(client)
}

pub async fn createUser(user: User) -> Result<User, DbError> {
    // Validate input
    if user.username.trim().is_empty() {
        return Err(DbError::ValidationError("Username cannot be empty".into()));
    }
    if user.wallet_address.trim().is_empty() {
        return Err(DbError::ValidationError(
            "Wallet address cannot be empty".into(),
        ));
    }

    let client = getGlobalClient().await?;

    // Check if username already exists
    let existing_username = client
        .query_opt(
            "SELECT id FROM users WHERE username = $1",
            &[&user.username],
        )
        .await?;

    if existing_username.is_some() {
        return Err(DbError::ValidationError("Username already taken".into()));
    }

    // Check if wallet address already exists
    let existing_wallet = client
        .query_opt(
            "SELECT id FROM users WHERE wallet_address = $1",
            &[&user.wallet_address],
        )
        .await?;

    if existing_wallet.is_some() {
        return Err(DbError::ValidationError(
            "User with this wallet address already exists".into(),
        ));
    }

    let result = client
        .query_one(
            "INSERT INTO users (username, wallet_address) VALUES ($1, $2) RETURNING id, created_at::text",
            &[&user.username, &user.wallet_address],
        )
        .await?;

    Ok(User {
        id: Some(result.get("id")),
        username: user.username,
        wallet_address: user.wallet_address,
        created_at: parse_timestamp(&result, "created_at"),
    })
}

pub async fn getAllUsers() -> Result<Vec<User>, DbError> {
    let client = getGlobalClient().await?;
    let result = client
        .query(
            "SELECT id, username, wallet_address, created_at::text FROM users ORDER BY created_at DESC",
            &[],
        )
        .await?;

    Ok(result
        .into_iter()
        .map(|row| User {
            id: Some(row.get("id")),
            username: row.get("username"),
            wallet_address: row.get("wallet_address"),
            created_at: parse_timestamp(&row, "created_at"),
        })
        .collect())
}

pub async fn getUserByWalletAddress(wallet_address: String) -> Result<User, DbError> {
    if wallet_address.trim().is_empty() {
        return Err(DbError::ValidationError(
            "Wallet address cannot be empty".into(),
        ));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_opt(
            "SELECT id, username, wallet_address, created_at::text FROM users WHERE wallet_address = $1",
            &[&wallet_address],
        )
        .await?;

    match result {
        Some(row) => Ok(User {
            id: Some(row.get("id")),
            username: row.get("username"),
            wallet_address: row.get("wallet_address"),
            created_at: parse_timestamp(&row, "created_at"),
        }),
        None => Err(DbError::NotFound(format!(
            "User with wallet address {} not found",
            wallet_address
        ))),
    }
}

pub async fn createIdea(idea: Idea) -> Result<Idea, DbError> {
    // Validate input
    if idea.title.trim().is_empty() {
        return Err(DbError::ValidationError("Title cannot be empty".into()));
    }
    if idea.description.trim().is_empty() {
        return Err(DbError::ValidationError(
            "Description cannot be empty".into(),
        ));
    }
    if idea.creator_id.trim().is_empty() {
        return Err(DbError::ValidationError(
            "Creator ID cannot be empty".into(),
        ));
    }
    if idea.category.trim().is_empty() {
        return Err(DbError::ValidationError("Category cannot be empty".into()));
    }
    if idea.initial_price <= 0.0 {
        return Err(DbError::ValidationError(
            "Initial price must be positive".into(),
        ));
    }
    if idea.target_price <= idea.initial_price {
        return Err(DbError::ValidationError(
            "Target price must be greater than initial price".into(),
        ));
    }
    if idea.timeframe.trim().is_empty() {
        return Err(DbError::ValidationError("Timeframe cannot be empty".into()));
    }
    if idea.risk_level < 1 || idea.risk_level > 10 {
        return Err(DbError::ValidationError(
            "Risk level must be between 1 and 10".into(),
        ));
    }
    if idea.market_size.trim().is_empty() {
        return Err(DbError::ValidationError(
            "Market size cannot be empty".into(),
        ));
    }
    if idea.competitive_advantage.trim().is_empty() {
        return Err(DbError::ValidationError(
            "Competitive advantage cannot be empty".into(),
        ));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_one(
            "INSERT INTO ideas (
                title, description, creator_id, category, initial_price, 
                target_price, timeframe, risk_level, market_size, 
                competitive_advantage, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id, created_at::text, updated_at::text",
            &[
                &idea.title,
                &idea.description,
                &idea.creator_id,
                &idea.category,
                &idea.initial_price,
                &idea.target_price,
                &idea.timeframe,
                &idea.risk_level,
                &idea.market_size,
                &idea.competitive_advantage,
                &"active",
            ],
        )
        .await?;

    Ok(Idea {
        id: Some(result.get("id")),
        title: idea.title,
        description: idea.description,
        creator_id: idea.creator_id,
        category: idea.category,
        initial_price: idea.initial_price,
        target_price: idea.target_price,
        timeframe: idea.timeframe,
        risk_level: idea.risk_level,
        market_size: idea.market_size,
        competitive_advantage: idea.competitive_advantage,
        status: "active".to_string(),
        resolution_outcome: None,
        created_at: parse_timestamp(&result, "created_at"),
        updated_at: parse_timestamp(&result, "updated_at"),
        resolved_at: None,
    })
}

pub async fn getIdeaById(id: &str) -> Result<Idea, DbError> {
    if id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_opt(
            "SELECT id, title, description, creator_id, status, resolution_outcome, 
                    created_at::text, updated_at::text, resolved_at::text 
             FROM ideas WHERE id = $1",
            &[&id],
        )
        .await?;

    match result {
        Some(row) => Ok(Idea {
            id: Some(row.get("id")),
            title: row.get("title"),
            description: row.get("description"),
            creator_id: row.get("creator_id"),
            status: row.get("status"),
            resolution_outcome: row.get("resolution_outcome"),
            created_at: parse_timestamp(&row, "created_at"),
            updated_at: parse_timestamp(&row, "updated_at"),
            resolved_at: parse_timestamp(&row, "resolved_at"),
            category: row.get("category"),
            initial_price: row.get("initial_price"),
            target_price: row.get("target_price"),
            timeframe: row.get("timeframe"),
            risk_level: row.get("risk_level"),
            market_size: row.get("market_size"),
            competitive_advantage: row.get("competitive_advantage"),
        }),
        None => Err(DbError::NotFound(format!("Idea with ID {} not found", id))),
    }
}

pub async fn createRate(rate: Rate) -> Result<Rate, DbError> {
    // Validate input
    if rate.idea_id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }
    if rate.rate < 0.0 {
        return Err(DbError::ValidationError("Rate cannot be negative".into()));
    }
    if rate.volume < 0.0 {
        return Err(DbError::ValidationError("Volume cannot be negative".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_one(
            "INSERT INTO rates (idea_id, rate, volume) 
             VALUES ($1, $2, $3) 
             RETURNING id, created_at::text",
            &[&rate.idea_id, &rate.rate, &rate.volume],
        )
        .await?;

    Ok(Rate {
        id: Some(result.get("id")),
        idea_id: rate.idea_id,
        rate: rate.rate,
        volume: rate.volume,
        created_at: parse_timestamp(&result, "created_at"),
    })
}

pub async fn getIdeaRates(idea_id: &str, limit: i64) -> Result<Vec<Rate>, DbError> {
    if idea_id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }
    if limit <= 0 {
        return Err(DbError::ValidationError("Limit must be positive".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query(
            "SELECT id, idea_id, rate, volume, created_at::text 
             FROM rates 
             WHERE idea_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2",
            &[&idea_id, &limit],
        )
        .await?;

    Ok(result
        .into_iter()
        .map(|row| Rate {
            id: Some(row.get("id")),
            idea_id: row.get("idea_id"),
            rate: row.get("rate"),
            volume: row.get("volume"),
            created_at: parse_timestamp(&row, "created_at"),
        })
        .collect())
}

pub async fn getAllIdeas() -> Result<Vec<Idea>, DbError> {
    let client = getGlobalClient().await?;
    let result = client.query("SELECT id, title, description, creator_id, status, resolution_outcome, created_at::text, updated_at::text, resolved_at::text FROM ideas ORDER BY created_at DESC", &[]).await?;
    Ok(result
        .into_iter()
        .map(|row| Idea {
            id: Some(row.get("id")),
            title: row.get("title"),
            description: row.get("description"),
            creator_id: row.get("creator_id"),
            status: row.get("status"),
            resolution_outcome: row.get("resolution_outcome"),
            created_at: parse_timestamp(&row, "created_at"),
            updated_at: parse_timestamp(&row, "updated_at"),
            resolved_at: parse_timestamp(&row, "resolved_at"),
            category: row.get("category"),
            initial_price: row.get("initial_price"),
            target_price: row.get("target_price"),
            timeframe: row.get("timeframe"),
            risk_level: row.get("risk_level"),
            market_size: row.get("market_size"),
            competitive_advantage: row.get("competitive_advantage"),
        })
        .collect())
}

pub async fn createTransaction(tx: Transaction) -> Result<Transaction, DbError> {
    // Validate input
    if tx.idea_id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }
    if tx.buyer_id.trim().is_empty() {
        return Err(DbError::ValidationError("Buyer ID cannot be empty".into()));
    }
    if tx.seller_id.trim().is_empty() {
        return Err(DbError::ValidationError("Seller ID cannot be empty".into()));
    }
    if tx.amount <= 0.0 {
        return Err(DbError::ValidationError("Amount must be positive".into()));
    }
    if tx.rate <= 0.0 {
        return Err(DbError::ValidationError("Rate must be positive".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_one(
            "INSERT INTO transactions 
             (idea_id, buyer_id, seller_id, amount, rate, total_value) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, created_at::text, updated_at::text",
            &[
                &tx.idea_id,
                &tx.buyer_id,
                &tx.seller_id,
                &tx.amount,
                &tx.rate,
                &tx.total_value,
            ],
        )
        .await?;

    Ok(Transaction {
        id: Some(result.get("id")),
        idea_id: tx.idea_id,
        buyer_id: tx.buyer_id,
        seller_id: tx.seller_id,
        amount: tx.amount,
        rate: tx.rate,
        total_value: tx.total_value,
        status: "pending".to_string(),
        created_at: parse_timestamp(&result, "created_at"),
        updated_at: parse_timestamp(&result, "updated_at"),
        completed_at: None,
    })
}

pub async fn getIdeaTransactions(idea_id: &str, limit: i64) -> Result<Vec<Transaction>, DbError> {
    if idea_id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }
    if limit <= 0 {
        return Err(DbError::ValidationError("Limit must be positive".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query(
            "SELECT id, idea_id, buyer_id, seller_id, amount, rate, total_value, status,
                    created_at::text, updated_at::text, completed_at::text
             FROM transactions 
             WHERE idea_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2",
            &[&idea_id, &limit],
        )
        .await?;

    Ok(result
        .into_iter()
        .map(|row| Transaction {
            id: Some(row.get("id")),
            idea_id: row.get("idea_id"),
            buyer_id: row.get("buyer_id"),
            seller_id: row.get("seller_id"),
            amount: row.get("amount"),
            rate: row.get("rate"),
            total_value: row.get("total_value"),
            status: row.get("status"),
            created_at: parse_timestamp(&row, "created_at"),
            updated_at: parse_timestamp(&row, "updated_at"),
            completed_at: parse_timestamp(&row, "completed_at"),
        })
        .collect())
}

pub async fn getCurrentRate(idea_id: &str) -> Result<Rate, DbError> {
    if idea_id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_opt(
            "SELECT id, idea_id, rate, volume, created_at::text 
             FROM rates 
             WHERE idea_id = $1 
             ORDER BY created_at DESC 
             LIMIT 1",
            &[&idea_id],
        )
        .await?;

    match result {
        Some(row) => Ok(Rate {
            id: Some(row.get("id")),
            idea_id: row.get("idea_id"),
            rate: row.get("rate"),
            volume: row.get("volume"),
            created_at: parse_timestamp(&row, "created_at"),
        }),
        None => Err(DbError::NotFound(format!(
            "No rates found for idea {}",
            idea_id
        ))),
    }
}

pub async fn getIdeaStats(idea_id: &str) -> Result<serde_json::Value, DbError> {
    if idea_id.trim().is_empty() {
        return Err(DbError::ValidationError("Idea ID cannot be empty".into()));
    }

    let client = getGlobalClient().await?;
    let result = client
        .query_one(
            "SELECT 
                COUNT(DISTINCT buyer_id) as unique_buyers,
                COUNT(DISTINCT seller_id) as unique_sellers,
                SUM(amount) as total_volume,
                AVG(rate) as avg_rate,
                MIN(rate) as min_rate,
                MAX(rate) as max_rate
             FROM transactions 
             WHERE idea_id = $1 AND status = 'completed'",
            &[&idea_id],
        )
        .await?;

    Ok(serde_json::json!({
        "unique_buyers": result.get::<_, i64>("unique_buyers"),
        "unique_sellers": result.get::<_, i64>("unique_sellers"),
        "total_volume": result.get::<_, f64>("total_volume"),
        "avg_rate": result.get::<_, f64>("avg_rate"),
        "min_rate": result.get::<_, f64>("min_rate"),
        "max_rate": result.get::<_, f64>("max_rate")
    }))
}
