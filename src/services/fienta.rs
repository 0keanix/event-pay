use chrono::{DateTime, FixedOffset, NaiveDateTime, TimeZone, Utc};
use reqwest::Client;
use serde::Deserialize;

use crate::config::FientaConfig;
use crate::error::AppError;

pub struct FientaService {
    client: Client,
    config: FientaConfig,
    timezone: FixedOffset,
}

#[derive(Debug, Deserialize)]
struct EventsResponse {
    events: Vec<Event>,
}

#[derive(Debug, Deserialize)]
struct Event {
    title: String,
    starts_at: String,
    ends_at: String,
}

impl FientaService {
    pub fn new(config: FientaConfig) -> Self {
        // Georgia timezone: UTC+4
        let timezone = FixedOffset::east_opt(4 * 3600).expect("Valid timezone");

        Self {
            client: Client::new(),
            config,
            timezone,
        }
    }

    /// Парсинг даты в формате Fienta: "2025-12-26 21:00:00"
    fn parse_datetime(&self, s: &str) -> Option<DateTime<Utc>> {
        // Парсим как "наивную" дату без timezone
        let naive = NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S").ok()?;

        // Привязываем к timezone из self и конвертируем в UTC
        self.timezone
            .from_local_datetime(&naive)
            .single()
            .map(|dt| dt.with_timezone(&Utc))
    }

    /// Получить название текущего события (30 мин до начала — до конца)
    pub async fn get_current_event_title(&self) -> Result<Option<String>, AppError> {
        let url = format!(
            "https://fienta.com/api/v1/public/events?organizer={}&locale=ru",
            self.config.organizer_id
        );

        let response: EventsResponse = self
            .client
            .get(&url)
            .header("Accept", "application/json")
            .send()
            .await?
            .json()
            .await
            .map_err(|e| AppError::Fienta(e.to_string()))?;

        let now = Utc::now();
        let thirty_minutes = chrono::Duration::minutes(30);

        for event in response.events {
            let starts_at = match self.parse_datetime(&event.starts_at) {
                Some(dt) => dt,
                None => continue,
            };
            let ends_at = match self.parse_datetime(&event.ends_at) {
                Some(dt) => dt,
                None => continue,
            };

            let window_start = starts_at - thirty_minutes;

            if now >= window_start && now <= ends_at {
                tracing::info!(event = %event.title, "Found current event");
                return Ok(Some(event.title));
            }
        }

        tracing::debug!("No current event found");
        Ok(None)
    }
}