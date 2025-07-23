# Multi-Bot Setup Guide

## Overview

This application now supports multiple Telegram bots with the following routing structure:

- **New Multi-Bot Routes** (on `ping.vansach.me`):
  - `POST /<bot_id>/<user_id>` - Send notification to specific user via specific bot
  - `POST /<bot_id>/process-updates` - Process Telegram webhook for specific bot

- **Legacy Routes** (still supported):
  - `POST /send-notifications/<chat_id>` - Send notification using legacy bot

## Architecture

Each route is implemented in a separate file under `src/routes/`:
- `multi-bot-process-updates.ts` - Multi-bot webhook processing
- `multi-bot-send-notifications.ts` - Multi-bot notification sending

Tests are co-located with their source files:
- `src/routes/*.test.ts` - Route handler tests
- `src/lib/*.test.ts` - Library function tests

## Setup Instructions

### 1. Deploy the Application

First, deploy the application with the new KV namespace:

```bash
wrangler deploy --env production
```

### 2. Set Up Bot Configuration

**REQUIRED**: Add bot configurations manually to the Workers KV namespace `BOT_CONFIG`:

1. Go to Cloudflare Workers dashboard
2. Navigate to your worker → KV → BOT_CONFIG
3. Add a new key-value pair for the legacy bot:
   - **Key**: `18xx.games` (required for legacy routes)
   - **Value**: 
     ```json
     {
       "token": "your_telegram_bot_token",
       "createdAt": "2024-01-01T00:00:00.000Z",
       "updatedAt": "2024-01-01T00:00:00.000Z"
     }
     ```

### 3. Configure Additional Bots

Repeat the process for each additional bot with a unique bot ID.

## Usage Examples

### Send Notification via Specific Bot

```bash
curl -X POST https://ping.vansach.me/18xx.games/123456789 \
  -H "Content-Type: application/json" \
  -d '{"game": "1830", "action": "turn_completed", "player": "John"}'
```

### Set Up Telegram Webhook for Specific Bot

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ping.vansach.me/18xx.games/process-updates"}'
```

## Migration Notes

- **BREAKING CHANGE**: Environment variable `TELEGRAM_BOT_18XX` is no longer supported
- All routes (legacy and new) now use KV storage exclusively
- Legacy routes load bot configuration from KV using ID `18xx.games`
- All bot configurations must be stored in Cloudflare KV storage
- Bot instances are cached in memory for performance
- Migration required: Move existing bot token from environment variable to KV storage

## Security Considerations

- Bot tokens are stored securely in Cloudflare KV
- Access to KV namespace should be restricted to authorized personnel only
- Consider implementing rate limiting for production endpoints 
