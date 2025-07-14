# 18xx Bot - Cloudflare Workers Multi-Bot Platform

A Telegram bot platform that supports multiple bot instances with configurable message parsing. Each bot can receive notifications from various sources (like 18xx.games) and forward them to Telegram chats with custom message processing.

## Features

- **Multi-Bot Support**: Host multiple Telegram bots on a single Workers instance
- **Configurable Message Parsers**: Each bot can use different message parsing strategies
- **KV-Based Configuration**: Bot tokens and settings stored in Cloudflare Workers KV
- **Legacy Compatibility**: Maintains backward compatibility with existing deployments
- **Global Edge Distribution**: Runs on Cloudflare Workers for low latency worldwide
- **TypeScript**: Full type safety and modern JavaScript features

## Architecture

### Multi-Bot Routing
- **New Routes**: `/bot/{botId}/process-updates` and `/bot/{botId}/send-notifications/{chatId}`
- **Legacy Routes**: `/process-updates` and `/send-notifications/{chatId}` (uses hardcoded `18xx.games` bot)
- **KV Storage**: Bot configurations stored in `BOT_CONFIG` namespace

### Message Parser System
Each bot can be configured with different message parsers:
- **Default Parser**: Universal parser that handles any message format
- **18xx Parser**: Specialized for 18xx.games notifications with validation and metadata
- **Extensible**: Easy to add custom parsers for new message sources

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd 18xx-bot
   npm install
   ```

2. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

3. **Configure Bots in KV**
   Add bot configurations to the `BOT_CONFIG` KV namespace:
   ```json
   {
     "token": "your-telegram-bot-token",
     "parser": "18xx"
   }
   ```

4. **Set Telegram Webhook**
   For new multi-bot routing:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://ping.vansach.me/bot/your-bot-id/process-updates"}'
   ```
   
   For legacy compatibility:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://ping.vansach.me/process-updates"}'
   ```

## Usage

### For Users

1. Start a chat with your bot on Telegram
2. Send `/start` to get setup instructions
3. Copy the webhook URL provided by the bot
4. Configure your notification source (e.g., 18xx.games):
   - Go to your profile/settings page
   - Set up webhook notifications
   - Use the webhook URL from the bot
   - Enter any text for User ID (e.g., "Hi")

### For Administrators

#### Adding a New Bot

1. **Create KV Entry**: Add bot configuration to `BOT_CONFIG` namespace
   ```json
   {
     "token": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
     "parser": "18xx"
   }
   ```

2. **Set Webhook**: Configure Telegram webhook to point to your bot's endpoint

3. **Test**: Send a test notification to verify everything works

See [PARSER_CONFIGURATION.md](./PARSER_CONFIGURATION.md) for detailed parser configuration options.

## API Endpoints

### Multi-Bot Routes
- `POST /bot/{botId}/process-updates` - Telegram webhook for specific bot
- `POST /bot/{botId}/send-notifications/{chatId}` - Notification webhook for specific bot

### Legacy Routes (Compatibility)
- `POST /process-updates` - Telegram webhook (uses `18xx.games` bot)
- `POST /send-notifications/{chatId}` - Notification webhook (uses `18xx.games` bot)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Start development server
npm run dev
```

## Testing

The project includes comprehensive tests for all functionality:

```bash
# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# Watch mode during development
npm run test:watch
```

## Configuration

### Bot Configuration in KV

Each bot is configured via a JSON object in the `BOT_CONFIG` KV namespace:

```json
{
  "token": "your-telegram-bot-token",
  "parser": "18xx"
}
```

**Required Fields:**
- `token`: Telegram bot token from @BotFather

**Optional Fields:**
- `parser`: Message parser to use ("default", "18xx", or custom parser name)

### Available Message Parsers

- **`default`**: Universal parser for any message format
- **`18xx`**: Specialized for 18xx.games notifications with validation

### Environment Configuration

The application uses Cloudflare Workers KV for configuration. No environment variables are required.

**KV Namespaces:**
- `BOT_CONFIG`: Stores bot configurations (tokens and parser settings)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Production Domains
- `ping.vansach.me` - Primary domain
- `18xx-bot.vansach.me` - Alternative domain

### Test Environment
- `test.ping.vansach.me` - Test domain
- `test.18xx-bot.vansach.me` - Alternative test domain

## Migration from Previous Versions

### From Environment Variable Configuration

The application no longer uses the `TELEGRAM_BOT_18XX` environment variable. All bot configurations are now stored in KV.

To migrate:
1. Add your bot configuration to KV with key `18xx.games`
2. Update webhook URLs if using legacy routes (optional)
3. Remove the environment variable

### From Single-Bot to Multi-Bot

Existing deployments will continue to work via legacy routes. To use multi-bot features:
1. Add additional bots to KV with unique keys
2. Configure webhooks using new multi-bot routes
3. Optionally migrate existing bot to explicit bot ID

## Architecture Details

### Core Components

- **Bot Repository**: Loads bot configurations from KV and instantiates bots
- **Message Parser Registry**: Manages available message parsers
- **Bot Class**: Encapsulates Telegram client and message parsing logic
- **Route Handlers**: Handle HTTP requests for different bot operations

### Message Flow

1. **Incoming Notification**: HTTP request to send-notifications endpoint
2. **Bot Resolution**: Load bot configuration from KV
3. **Message Parsing**: Parse message using configured parser
4. **Validation**: Check if parsed message is valid
5. **Telegram Delivery**: Send formatted message to Telegram

### Parser Architecture

- **Parser Interface**: Standard interface for all message parsers
- **Registry Pattern**: Centralized parser management with fallback
- **Extensible Design**: Easy to add new parsers for different message sources

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation as needed
7. Submit a pull request

## License

MIT

## Related Documentation

- [Parser Configuration Guide](./PARSER_CONFIGURATION.md) - Detailed parser setup and customization
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
