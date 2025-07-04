# 18xx Bot - Cloudflare Workers Edition

A Telegram bot that sends notifications from 18xx.games to Telegram chats. This application runs on Cloudflare Workers and provides webhooks for both Telegram bot updates and 18xx.games notifications.

## Features

- **Telegram Bot Integration**: Responds to `/start` command with setup instructions
- **18xx.games Webhook**: Receives game notifications and forwards them to Telegram
- **Cloudflare Workers**: Serverless deployment with global edge distribution
- **TypeScript**: Full type safety and modern JavaScript features

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd 18xx-bot
   yarn install
   ```

2. **Configure Secrets**
   ```bash
   wrangler secret put TELEGRAM_BOT_18XX
   # Enter your Telegram bot token
   ```

3. **Deploy**
   ```bash
   yarn build
   yarn deploy
   ```

4. **Set Telegram Webhook**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://your-worker-url.workers.dev/process-updates"}'
   ```

## Usage

### For Users

1. Start a chat with your bot on Telegram
2. Send `/start` to get setup instructions
3. Copy the webhook URL provided by the bot
4. Go to your [18xx.games profile page](https://18xx.games/profile)
5. Set up webhook notifications:
   - **Turn/Message Notifications**: Webhook
   - **Webhook**: Custom
   - **Webhook URL**: Paste the URL from the bot
   - **Webhook User ID**: Enter any text (e.g., "Hi")

### For Developers

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## API Endpoints

- `POST /process-updates` - Telegram webhook endpoint
- `POST /send-notifications/{chatId}` - 18xx.games webhook endpoint

## Development

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Run tests
yarn test

# Start development server
yarn dev
```

## Testing

The project includes comprehensive tests for both the bot functionality and Workers integration:

```bash
yarn test
```

## Architecture

This application is built with:

- **Cloudflare Workers**: Serverless runtime
- **TypeScript**: Type-safe JavaScript
- **Jest**: Testing framework
- **Wrangler**: Cloudflare Workers CLI tool

## Migration from AWS Lambda

This project has been migrated from AWS Lambda to Cloudflare Workers. Key changes include:

- Replaced AWS SDK with Cloudflare Workers APIs
- Migrated from AWS SecretsManager to Workers environment variables
- Updated handler format from Lambda to Workers fetch handler
- Replaced AWS SAM with Wrangler configuration

All functionality remains identical from the user perspective.

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request
