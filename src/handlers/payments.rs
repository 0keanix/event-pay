use axum::{
    extract::{Multipart, State},
    Json,
};
use serde::{Deserialize, Serialize};

use crate::error::AppError;
use crate::AppState;

#[derive(Debug, Serialize)]
pub struct SuccessResponse {
    success: bool,
    event: Option<String>,
}

/// POST /api/bank-transfer
/// Content-Type: multipart/form-data
/// - screenshot: file (required)
pub async fn bank_transfer(
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<SuccessResponse>, AppError> {
    let mut screenshot: Option<Vec<u8>> = None;

    // Парсим multipart form
    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::Validation(e.to_string()))?
    {
        if field.name() == Some("screenshot") {
            screenshot = Some(
                field
                    .bytes()
                    .await
                    .map_err(|e| AppError::Validation(e.to_string()))?
                    .to_vec(),
            );
        }
    }

    let screenshot = screenshot.ok_or_else(|| {
        AppError::Validation("Screenshot is required".into())
    })?;

    if screenshot.is_empty() {
        return Err(AppError::Validation("Screenshot file is empty".into()));
    }

    tracing::info!(size = screenshot.len(), "Received bank transfer screenshot");

    // Получаем текущее событие (игнорируем ошибки)
    let event_title = state.fienta.get_current_event_title().await.ok().flatten();

    // Отправляем в Telegram
    state
        .telegram
        .notify_bank_transfer(screenshot, event_title.as_deref())
        .await?;

    Ok(Json(SuccessResponse {
        success: true,
        event: event_title,
    }))
}

#[derive(Debug, Deserialize)]
pub struct UsdtPayload {
    pub transaction_link: String,
}

/// POST /api/usdt
/// Content-Type: application/json
/// { "transaction_link": "https://tronscan.org/#/transaction/..." }
pub async fn usdt(
    State(state): State<AppState>,
    Json(payload): Json<UsdtPayload>,
) -> Result<Json<SuccessResponse>, AppError> {
    // Валидация ссылки
    if payload.transaction_link.is_empty() {
        return Err(AppError::Validation("Transaction link is required".into()));
    }

    // Проверяем, что это TronScan
    if !payload.transaction_link.contains("tronscan.org")
        && !payload.transaction_link.contains("tronscan.io")
    {
        return Err(AppError::Validation(
            "Transaction link must be from TronScan".into(),
        ));
    }

    tracing::info!(link = %payload.transaction_link, "Received USDT payment");

    // Получаем текущее событие
    let event_title = state.fienta.get_current_event_title().await.ok().flatten();

    // Отправляем в Telegram
    state
        .telegram
        .notify_usdt(&payload.transaction_link, event_title.as_deref())
        .await?;

    Ok(Json(SuccessResponse {
        success: true,
        event: event_title,
    }))
}