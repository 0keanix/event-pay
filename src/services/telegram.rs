use reqwest::{multipart, Client};
use serde::Deserialize;

use crate::config::TelegramConfig;
use crate::error::AppError;

pub struct TelegramService {
    client: Client,
    config: TelegramConfig,
}

#[derive(Debug, Deserialize)]
struct TelegramResponse {
    ok: bool,
    description: Option<String>,
}

impl TelegramService {
    pub fn new(config: TelegramConfig) -> Self {
        Self {
            client: Client::new(),
            config,
        }
    }

    fn base_url(&self) -> String {
        format!("https://api.telegram.org/bot{}", self.config.bot_token)
    }

    fn format_timestamp() -> String {
        chrono::Utc::now()
            .with_timezone(&chrono_tz::Asia::Tbilisi)
            .format("%d.%m.%Y %H:%M")
            .to_string()
    }

    /// Отправка текстового сообщения
    async fn send_message(&self, text: &str, parse_mode: Option<&str>) -> Result<(), AppError> {
        let mut params = vec![
            ("chat_id", self.config.chat_id.clone()),
            ("text", text.to_string()),
        ];

        if let Some(mode) = parse_mode {
            params.push(("parse_mode", mode.to_string()));
        }

        if let Some(thread_id) = self.config.thread_id {
            params.push(("message_thread_id", thread_id.to_string()));
        }

        let response: TelegramResponse = self
            .client
            .post(format!("{}/sendMessage", self.base_url()))
            .form(&params)
            .send()
            .await?
            .json()
            .await?;

        if !response.ok {
            return Err(AppError::Telegram(
                response.description.unwrap_or_else(|| "Unknown error".into()),
            ));
        }

        Ok(())
    }

    /// Отправка фото с caption
    async fn send_photo(&self, photo_bytes: Vec<u8>, caption: &str) -> Result<(), AppError> {
        let photo_part = multipart::Part::bytes(photo_bytes)
            .file_name("screenshot.jpg")
            .mime_str("image/jpeg")
            .map_err(|e| AppError::Internal(e.into()))?;

        let mut form = multipart::Form::new()
            .text("chat_id", self.config.chat_id.clone())
            .text("caption", caption.to_string())
            .text("parse_mode", "Markdown")
            .part("photo", photo_part);

        if let Some(thread_id) = self.config.thread_id {
            form = form.text("message_thread_id", thread_id.to_string());
        }

        let response: TelegramResponse = self
            .client
            .post(format!("{}/sendPhoto", self.base_url()))
            .multipart(form)
            .send()
            .await?
            .json()
            .await?;

        if !response.ok {
            return Err(AppError::Telegram(
                response.description.unwrap_or_else(|| "Unknown error".into()),
            ));
        }

        Ok(())
    }

    /// Уведомление о банковском переводе (со скриншотом)
    pub async fn notify_bank_transfer(
        &self,
        screenshot: Vec<u8>,
        event_title: Option<&str>,
    ) -> Result<(), AppError> {
        let event_line = event_title
            .map(|t| format!("\n🎭 Событие: *{}*", escape_markdown(t)))
            .unwrap_or_default();

        let caption = format!(
            "🏦 *Банковский перевод*{}\n\n🕐 Время: {}",
            event_line,
            Self::format_timestamp()
        );

        self.send_photo(screenshot, &caption).await
    }

    /// Уведомление о USDT переводе
    pub async fn notify_usdt(
        &self,
        transaction_link: &str,
        event_title: Option<&str>,
    ) -> Result<(), AppError> {
        let event_line = event_title
            .map(|t| format!("\n🎭 Событие: {}", t))
            .unwrap_or_default();

        let message = format!(
            "💰 USDT перевод (TRC-20){}\n\n🔗 Транзакция: {}\n🕐 Время: {}",
            event_line,
            transaction_link,
            Self::format_timestamp()
        );

        // Без parse_mode, чтобы ссылка была кликабельной
        self.send_message(&message, None).await
    }

    /// Уведомление об оплате картой (из Fienta webhook)
    pub async fn notify_card_payment(
        &self,
        amount: f64,
        currency: &str,
        event_title: Option<&str>,
    ) -> Result<(), AppError> {
        let event_line = event_title
            .map(|t| format!("\n🎭 Событие: *{}*", escape_markdown(t)))
            .unwrap_or_default();

        let message = format!(
            "🎟 *Оплата картой на Fienta*{}\n\n💰 *Сумма:* {:.2} {}",
            event_line, amount, currency
        );

        self.send_message(&message, Some("Markdown")).await
    }
}

/// Экранирование спецсимволов Markdown
fn escape_markdown(text: &str) -> String {
    text.replace('_', r"\_")
        .replace('*', r"\*")
        .replace('[', r"\[")
        .replace(']', r"\]")
        .replace('(', r"\(")
        .replace(')', r"\)")
        .replace('~', r"\~")
        .replace('`', r"\`")
        .replace('>', r"\>")
        .replace('#', r"\#")
        .replace('+', r"\+")
        .replace('-', r"\-")
        .replace('=', r"\=")
        .replace('|', r"\|")
        .replace('{', r"\{")
        .replace('}', r"\}")
        .replace('.', r"\.")
        .replace('!', r"\!")
}