mod config;
mod error;
mod handlers;
mod routes;
mod services;

use std::sync::Arc;

use config::Config;
use services::{FientaService, TelegramService};

#[derive(Clone)]
pub struct AppState {
    pub telegram: Arc<TelegramService>,
    pub fienta: Arc<FientaService>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load .env file
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("eventpay=debug".parse()?)
        )
        .init();

    // Load configuration
    let config = Config::from_env().expect("Failed to load configuration");
    tracing::info!(?config.bind_address, "Starting server");

    // Initialize services
    let telegram = Arc::new(TelegramService::new(config.telegram));
    let fienta = Arc::new(FientaService::new(config.fienta));

    let state = AppState { telegram, fienta };

    // Create router
    let app = routes::create_router(state);

    // Start server
    let listener = tokio::net::TcpListener::bind(&config.bind_address).await?;
    tracing::info!("Listening on {}", config.bind_address);

    axum::serve(listener, app).await?;

    Ok(())
}