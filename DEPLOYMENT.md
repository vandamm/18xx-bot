# Deployment Guide for Cloudflare Workers

This application has been migrated from AWS Lambda to Cloudflare Workers. Below are the deployment instructions.

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Workers enabled
2. **Domain**: A domain managed by Cloudflare (if using custom routes)
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

## Configuration

### 1. Wrangler Authentication

```bash
wrangler auth login
```

### 2. Environment Variables

Set up your secrets using Wrangler:

```bash
wrangler secret put TELEGRAM_BOT_18XX
# Enter your Telegram bot token when prompted
```

### 3. Update wrangler.toml

Edit the `wrangler.toml` file to match your setup:

```toml
name = "18xx-bot"
main = "dist/index.js"
compatibility_date = "2023-12-18"

[env.production]
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]

[vars]
WEBHOOK_URL_18XX = "https://your-domain.com/send-notifications/"
```

## Deployment Steps

### 1. Build the Project

```bash
yarn install
yarn build
```

### 2. Deploy to Cloudflare Workers

```bash
# Deploy to development
wrangler deploy

# Deploy to production
wrangler deploy --env production
```

### 3. Verify Deployment

The worker will be available at:
- Development: `https://18xx-bot.your-subdomain.workers.dev`
- Production: `https://your-domain.com` (if using custom routes)

## API Endpoints

The application exposes two endpoints:

### 1. Process Updates (Telegram Webhook)
- **URL**: `POST /process-updates`
- **Purpose**: Handles incoming Telegram webhook updates
- **Usage**: Set this as your Telegram bot webhook URL

### 2. Send Notifications (18xx.games Webhook)
- **URL**: `POST /send-notifications/{chatId}`
- **Purpose**: Receives notifications from 18xx.games and sends them to Telegram
- **Usage**: Users configure this URL in their 18xx.games profile

## Setting Up Telegram Bot

1. Create a new bot with [@BotFather](https://t.me/BotFather)
2. Get the bot token and set it as a secret:
   ```bash
   wrangler secret put TELEGRAM_BOT_18XX
   ```
3. Set the webhook URL for your bot:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://your-domain.com/process-updates"}'
   ```

## Testing

Run the test suite to verify everything works:

```bash
yarn test
```

## Local Development

For local development:

```bash
yarn dev
```

This will start the Wrangler development server with hot reloading.

## Migration Notes

### Key Changes from AWS Lambda

1. **Handler Format**: Migrated from Lambda's `APIGatewayProxyHandler` to Workers' `fetch` handler
2. **Environment Variables**: Using Cloudflare Workers environment variables instead of AWS SecretsManager
3. **Routing**: Implemented custom routing logic instead of API Gateway
4. **Testing**: Created Workers-specific test mocks

### Preserved Functionality

- All original endpoints and response formats are preserved
- Telegram bot functionality remains identical
- 18xx.games webhook integration works the same way
- Message parsing and templates are unchanged

## Troubleshooting

### Common Issues

1. **Secret not found**: Make sure you've set the `TELEGRAM_BOT_18XX` secret using `wrangler secret put`
2. **Route not working**: Check your domain configuration in Cloudflare and wrangler.toml
3. **Build errors**: Ensure all dependencies are installed with `yarn install`

### Logs

View Worker logs:
```bash
wrangler tail
```

### Testing Locally

Use the development server for local testing:
```bash
wrangler dev
```

This will give you a local URL to test your endpoints. 