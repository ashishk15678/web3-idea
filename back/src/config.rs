use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub allowed_origins: Vec<String>,
    pub database_url: String,
    pub server_port: u16,
    pub server_host: String,
}

impl Config {
    pub fn new() -> Self {
        // Get allowed origins from environment or use defaults
        let allowed_origins = env::var("ALLOWED_ORIGINS")
            .unwrap_or_else(|_| "http://localhost:3000".to_string())
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        // Get database configuration
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/postgres".to_string());

        // Get server configuration
        let server_port = env::var("SERVER_PORT")
            .unwrap_or_else(|_| "8080".to_string())
            .parse()
            .expect("SERVER_PORT must be a number");

        let server_host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());

        Self {
            allowed_origins,
            database_url,
            server_port,
            server_host,
        }
    }

    pub fn get_cors_origins(&self) -> Vec<String> {
        self.allowed_origins.clone()
    }
}

// Create a global configuration instance
lazy_static::lazy_static! {
    pub static ref CONFIG: Config = Config::new();
}
