# Bot Message Parser Configuration

This document explains how to configure message parsers for your bots in the KV storage system.

## Available Parsers

### 1. Default Parser (`default`)
- **Purpose**: General-purpose parser that handles any message format
- **Behavior**: 
  - Extracts text from `text`, `content`, or `message` fields
  - Extracts links from `link` or `url` fields
  - Falls back to JSON.stringify for complex objects
  - Always returns `valid: true`

### 2. 18xx Games Parser (`18xx`)
- **Purpose**: Specialized parser for 18xx.games notifications
- **Behavior**:
  - Parses structured game notifications from 18xx.games
  - Extracts game details (title, round, turn, etc.)
  - Validates message format and returns `valid: false` for invalid messages
  - Provides rich metadata including user ID, game state, etc.

## Bot Configuration Format

Each bot in the KV storage should have the following JSON structure:

```json
{
  "token": "your-telegram-bot-token",
  "parser": "parser-name",
  "configurationMessage": "optional-custom-configuration-message",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Configurable Configuration Messages

### Overview

Bots can now have custom configuration messages that are displayed when users send `/start` to the bot. This message should contain setup instructions and must include the `{{WEBHOOK_URL}}` placeholder that will be replaced with the actual webhook URL.

### Required Behavior

- **Process-Updates Hook**: Bots that have a configuration message set up in KV **MUST** react to the "process-updates" hook (this is already implemented)
- **Placeholder Replacement**: The message must contain `{{WEBHOOK_URL}}` which gets replaced with the actual webhook URL
- **Fallback**: If no custom message is configured, the bot uses the default configuration message

### Placeholder Format

Use these placeholders in your configuration message:

- `{{WEBHOOK_URL}}` - Full webhook URL with user ID (e.g., `https://your-domain.com/send-notifications/123456789`)
- `{{WEBHOOK_BASE_URL}}` - Webhook base URL without user ID (e.g., `https://your-domain.com/send-notifications`)
- `{{USER_ID}}` - Just the user/chat ID (e.g., `123456789`)

### Example Custom Configuration Messages

#### Simple Message
```json
{
  "token": "your-bot-token",
  "parser": "default",
  "configurationMessage": "Setup your webhook URL: {{WEBHOOK_URL}}",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Flexible Setup with Separate Fields
```json
{
  "token": "your-bot-token",
  "parser": "default",
  "configurationMessage": "📬 **Webhook Setup**\n\n**Option 1 - Direct URL:**\nWebhook URL: `{{WEBHOOK_URL}}`\n\n**Option 2 - Separate Fields:**\nWebhook Base: `{{WEBHOOK_BASE_URL}}`\nUser ID: `{{USER_ID}}`",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

When a user with chat ID `123456789` sends `/start`, they would receive:

```
📬 **Webhook Setup**

**Option 1 - Direct URL:**
Webhook URL: `https://ping.vansach.me/send-notifications/123456789`

**Option 2 - Separate Fields:**
Webhook Base: `https://ping.vansach.me/send-notifications`
User ID: `123456789`
```

#### Rich Configuration Message
```json
{
  "token": "your-bot-token",
  "parser": "18xx",
  "configurationMessage": "🎮 **Game Notifications Setup**\n\nTo receive notifications from 18xx.games:\n\n1. Go to your [18xx.games profile page](https://18xx.games/profile)\n2. Set these values:\n\n*Turn/Message Notifications*: Webhook\n*Webhook*: Custom\n*Webhook URL*: `{{WEBHOOK_URL}}`\n*Webhook User ID*: Type anything here, maybe \"Hi\"\n\n🚀 You're all set! You'll receive notifications here when it's your turn.",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

When a user with chat ID `123456789` sends `/start`, they will receive:

```
🎮 **Game Notifications Setup**

To receive notifications from 18xx.games:

1. Go to your [18xx.games profile page](https://18xx.games/profile)
2. Set these values:

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: `https://ping.vansach.me/send-notifications/123456789`
*Webhook User ID*: Type anything here, maybe "Hi"

🚀 You're all set! You'll receive notifications here when it's your turn.
```

### Configuration Examples

#### Bot with Default Parser
```json
{
  "token": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "parser": "default",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Bot with 18xx Games Parser
```json
{
  "token": "789012:XYZ-ABC9876def-321W5t7u456ew22", 
  "parser": "18xx",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Bot with Custom Configuration Message
```json
{
  "token": "345678:QRS-TUV3456hij-987Y8u9i678ew33",
  "parser": "18xx",
  "configurationMessage": "🚀 **Custom Bot Setup**\n\nUse this webhook URL in your game settings: {{WEBHOOK_URL}}\n\nEnjoy your notifications!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Bot with No Parser Specified (defaults to 'default')
```json
{
  "token": "345678:QRS-TUV3456hij-987Y8u9i678ew33",
  "createdAt": "2024-01-01T00:00:00.000Z", 
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Setting Up Bot Configurations

### Using Wrangler CLI

1. **Add a bot with default parser:**
```bash
wrangler kv:key put --binding=BOT_CONFIG "my-general-bot" '{
  "token": "your-bot-token",
  "parser": "default",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}'
```

2. **Add a bot with 18xx parser:**
```bash
wrangler kv:key put --binding=BOT_CONFIG "18xx.games" '{
  "token": "your-18xx-bot-token", 
  "parser": "18xx",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}'
```

3. **Add a bot with custom configuration message:**
```bash
wrangler kv:key put --binding=BOT_CONFIG "custom-bot" '{
  "token": "your-bot-token",
  "parser": "default",
  "configurationMessage": "🎮 Setup: {{WEBHOOK_URL}} (Base: {{WEBHOOK_BASE_URL}}, ID: {{USER_ID}})",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}'
```

### Using Cloudflare Dashboard

1. Go to your Cloudflare Workers dashboard
2. Select your worker
3. Go to "Settings" → "Variables"
4. Find your KV namespace binding
5. Add key-value pairs with bot IDs as keys and JSON configurations as values

## Message Flow

1. **Request arrives** at `/botId/chatId` endpoint
2. **Bot instance loaded** from KV storage using `botId`
3. **Parser determined** from bot configuration (`parser` field)
4. **Message parsed** using the configured parser
5. **Validation check** - if `valid: false`, return 422 error
6. **Message sent** to Telegram using parsed content and optional link

## Configuration Message Flow

1. **User sends `/start`** to bot via Telegram
2. **Telegram sends webhook** to `/botId/process-updates` endpoint
3. **Bot loaded** from KV storage using `botId`
4. **Configuration message retrieved** from bot configuration (or default if none configured)
5. **Placeholder replaced** - `{{WEBHOOK_URL}}` becomes actual webhook URL
6. **Message sent** to user via Telegram

### Default Configuration Message

If no custom `configurationMessage` is configured, bots will use this generic default message:

```
🔔 **Webhook Notifications Setup**

To receive notifications in this chat:

1. Copy this webhook URL: `https://your-domain.com/send-notifications/123456789`
2. Configure your notification source to send webhooks to this URL
3. Set any required User ID field to any value (e.g., "notifications")

✅ You're all set! Notifications will be delivered to this chat.
```

This generic message works for any webhook-based notification system, not just specific gaming platforms.

## Parser Behavior Examples

### Default Parser Input/Output

**Input:**
```json
{
  "text": "Hello world",
  "link": "https://example.com"
}
```

**Output:**
```javascript
{
  content: "Hello world",
  link: "https://example.com", 
  valid: true,
  metadata: { originalMessage: {...} }
}
```

### 18xx Parser Input/Output

**Input:**
```json
{
  "text": "<@U123456> has started their turn in 1830 \"Testing Game\" (Operating Round 2)\nhttps://18xx.games/game/12345"
}
```

**Output:**
```javascript
{
  content: "has started their turn in 1830 \"Testing Game\" (Operating Round 2)",
  link: "https://18xx.games/game/12345",
  valid: true,
  metadata: {
    userId: "U123456",
    text: "has started their turn", 
    title: "1830",
    description: "Testing Game",
    round: "Operating Round",
    turn: 2,
    originalMessage: {...}
  }
}
```

## Adding Custom Parsers

To add a new parser:

1. Create a new parser class implementing `MessageParser` interface
2. Register it in `src/lib/message-parsers/registry.ts`
3. Update this documentation with the new parser details

Example custom parser:
```typescript
import { MessageParser, ParsedMessage } from './types';

export class CustomParser implements MessageParser {
  name = 'custom';

  parse(message: object): ParsedMessage {
    // Your custom parsing logic here
    return {
      content: "parsed content",
      valid: true
    };
  }
}
``` 