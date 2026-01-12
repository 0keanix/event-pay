# Build stage
FROM rust:1.92.0-slim-bookworm AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy manifests for dependency caching
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && echo "" > src/lib.rs
RUN cargo build --release
RUN rm -rf src

# Build release binary
COPY src ./src
RUN touch src/main.rs src/lib.rs && cargo build --release

# Runtime stage
FROM gcr.io/distroless/cc-debian12

WORKDIR /app

# ✅ Исправлено: event-pay вместо eventpay
COPY --from=builder /app/target/release/event-pay /app/event-pay

EXPOSE 3000

# ✅ Исправлено: event-pay вместо eventpay
CMD ["/app/event-pay"]