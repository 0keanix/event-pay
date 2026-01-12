use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use event_pay::{config, routes, services, AppState};
use std::sync::Arc;
use tower::ServiceExt;

// Helper to create test app
fn create_test_app() -> axum::Router {
    let telegram_config = config::TelegramConfig {
        bot_token: "test_token".into(),
        chat_id: "test_chat".into(),
        thread_id: None,
    };
    let fienta_config = config::FientaConfig {
        organizer_id: "12345".into(),
    };

    let state = AppState {
        telegram: Arc::new(services::TelegramService::new(telegram_config)),
        fienta: Arc::new(services::FientaService::new(fienta_config)),
    };

    routes::create_router(state)
}

#[tokio::test]
async fn health_check_returns_ok() {
    let app = create_test_app();

    let response = app
        .oneshot(Request::get("/health").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn bank_transfer_requires_screenshot() {
    let app = create_test_app();

    let response = app
        .oneshot(
            Request::post("/api/bank-transfer")
                .header("content-type", "multipart/form-data; boundary=----test")
                .body(Body::from("------test--\r\n"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn usdt_requires_transaction_link() {
    let app = create_test_app();

    let response = app
        .oneshot(
            Request::post("/api/usdt")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"transaction_link": ""}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn usdt_requires_tronscan_domain() {
    let app = create_test_app();

    let response = app
        .oneshot(
            Request::post("/api/usdt")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"transaction_link": "https://example.com/tx"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn fienta_webhook_ignores_non_target_events() {
    let app = create_test_app();

    let payload = r#"{
        "order": {
            "event": {"url": "https://fienta.com/some-other-event"},
            "payment": {"total": 1000, "currency": "EUR"}
        }
    }"#;

    let response = app
        .oneshot(
            Request::post("/webhooks/fienta")
                .header("content-type", "application/json")
                .body(Body::from(payload))
                .unwrap(),
        )
        .await
        .unwrap();

    // Should return OK but not process (no notification sent)
    assert_eq!(response.status(), StatusCode::OK);
}
