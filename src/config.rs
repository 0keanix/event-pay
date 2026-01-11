use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub bind_address: String,
    pub telegram: TelegramConfig,
    pub fienta: FientaConfig,
}

#[derive(Debug, Clone)]
pub struct TelegramConfig {
    pub bot_token: String,
    pub chat_id: String,
    pub thread_id: Option<i64>,
}

#[derive(Debug, Clone)]
pub struct FientaConfig {
    pub organizer_id: String,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        Ok(Self {
            bind_address: env::var("BIND_ADDRESS")
                .unwrap_or_else(|_| "0.0.0.0:3000".into()),
            telegram: TelegramConfig {
                bot_token: env::var("TELEGRAM_BOT_TOKEN")?,
                chat_id: env::var("TELEGRAM_CHAT_ID")?,
                thread_id: env::var("TELEGRAM_THREAD_ID")
                    .ok()
                    .and_then(|s| s.parse().ok()),
            },
            fienta: FientaConfig {
                organizer_id: env::var("FIENTA_ORGANIZER_ID")
                    .unwrap_or_else(|_| "28251".into()),
            },
        })
    }
}