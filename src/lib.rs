pub mod config;
pub mod error;
pub mod handlers;
pub mod routes;
pub mod services;

use std::sync::Arc;

use services::{FientaService, TelegramService};

#[derive(Clone)]
pub struct AppState {
    pub telegram: Arc<TelegramService>,
    pub fienta: Arc<FientaService>,
}
