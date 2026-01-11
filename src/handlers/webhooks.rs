use axum::{extract::State, http::StatusCode, Json};
use serde::Deserialize;

use crate::error::AppError;
use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct FientaWebhook {
    pub order: FientaOrder,
}

#[derive(Debug, Deserialize)]
pub struct FientaOrder {
    pub event: Option<FientaEvent>,
    pub payment: Option<FientaPayment>,
}

#[derive(Debug, Deserialize)]
pub struct FientaEvent {
    pub url: String,
}

#[derive(Debug, Deserialize)]
pub struct FientaPayment {
    pub total: i64, // в центах
    pub currency: String,
}

/// POST /webhooks/fienta
pub async fn fienta(
    State(state): State<AppState>,
    Json(payload): Json<FientaWebhook>,
) -> Result<StatusCode, AppError> {
    tracing::info!(?payload, "Received Fienta webhook");

    // Фильтр: только событие "oplatit-kartoy"
    let event_url = payload
        .order
        .event
        .as_ref()
        .map(|e| e.url.as_str())
        .unwrap_or("");

    if !event_url.contains("oplatit-kartoy") {
        tracing::debug!(url = %event_url, "Skipping non-target event");
        return Ok(StatusCode::OK);
    }

    // Извлекаем данные платежа
    let (amount, currency) = payload
        .order
        .payment
        .map(|p| (p.total as f64 / 100.0, p.currency))
        .unwrap_or((0.0, "EUR".into()));

    // Получаем текущее событие
    let event_title = state.fienta.get_current_event_title().await.ok().flatten();

    // Отправляем в Telegram
    state
        .telegram
        .notify_card_payment(amount, &currency, event_title.as_deref())
        .await?;

    Ok(StatusCode::OK)
}