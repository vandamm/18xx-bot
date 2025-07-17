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
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
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