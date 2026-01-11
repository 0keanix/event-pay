# 🎟️ Event-Pay

Lightweight payment notification relay for event payments. Forwards payment confirmations to Telegram.

## Features

- 🏦 **Bank Transfer** — Upload screenshot, send to Telegram
- 💰 **USDT TRC-20** — Submit transaction link, send to Telegram
- 💳 **Fienta Webhook** — Receive card payment notifications
- 🎭 **Auto Event Detection** — Fetches current event from Fienta API

## Tech Stack

- **Backend:** Rust + Axum
- **Frontend:** React + Vite + Tailwind CSS
- **Deployment:** Docker + Nginx

## Quick Start

### Prerequisites

- Rust 1.92+
- Node.js 20+
- Docker (for deployment)

### Backend
```bash
# Clone
git clone https://github.com/0keanix/event-pay.git
cd event-pay

# Configure
cp .env.example .env
# Edit .env with your Telegram credentials

# Run
cargo run
```

### Frontend
```bash
cd frontend/event-pay

npm install
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token |
| `TELEGRAM_CHAT_ID` | Target chat ID |
| `TELEGRAM_THREAD_ID` | Thread ID (optional, for topics) |
| `FIENTA_ORGANIZER_ID` | Fienta organizer ID (default: 28251) |
| `BIND_ADDRESS` | Server address (default: 0.0.0.0:3000) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bank-transfer` | Upload payment screenshot (multipart) |
| `POST` | `/api/usdt` | Submit transaction link (JSON) |
| `POST` | `/webhooks/fienta` | Fienta payment webhook |
| `GET` | `/health` | Health check |

## Deployment
```bash
docker compose up -d
```

## License

MIT