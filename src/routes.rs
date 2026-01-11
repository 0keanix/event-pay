use axum::{
    routing::{get, post},
    Router,
};
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};

use crate::handlers::{payments, webhooks};
use crate::AppState;

pub fn create_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Health check
    let health = Router::new().route("/health", get(|| async { "OK" }));

    // API routes
    let api = Router::new()
        .route("/bank-transfer", post(payments::bank_transfer))
        .route("/usdt", post(payments::usdt));

    // Webhook routes
    let webhooks = Router::new().route("/fienta", post(webhooks::fienta));

    Router::new()
        .merge(health)
        .nest("/api", api)
        .nest("/webhooks", webhooks)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}