import { Bot } from './bot';
import { DefaultParser } from './message-parsers/default-parser';

describe('Bot', () => {
  let bot: Bot;
  let parser: DefaultParser;

  beforeEach(() => {
    parser = new DefaultParser();
    bot = new Bot('test-token', parser);
  });

  it('should create bot instance', () => {
    expect(bot).toBeInstanceOf(Bot);
  });

  it('should throw error if no access token provided', () => {
    expect(() => new Bot('', parser)).toThrow('Access token undefined');
  });

  it('should parse message using provided parser', () => {
    const message = { text: 'test message' };
    const result = bot.parseMessage(message);

    expect(result.content).toBe('test message');
    expect(result.valid).toBe(true);
  });

  it('should create bot with custom configuration message', () => {
    const customMessage = 'Custom setup: {{WEBHOOK_URL}}';
    const botWithCustomMessage = new Bot('test-token', parser, customMessage);
    expect(botWithCustomMessage).toBeInstanceOf(Bot);
  });

  describe('processUpdate with configuration messages', () => {
    const mockSendMessage = jest.fn();
    
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should use default configuration message when none provided', async () => {
      const bot = new Bot('test-token', parser);
      bot.sendMessage = mockSendMessage;

      const startUpdate = {
        update_id: 1,
        message: {
          message_id: 1,
          date: Date.now(),
          chat: { id: 123, type: 'private' as const },
          text: '/start'
        }
      } as any;

      await bot.processUpdate(startUpdate, 'https://test.com');

      expect(mockSendMessage).toHaveBeenCalledWith(123, expect.stringContaining('https://test\\.com/send\\-notifications/123'));
      expect(mockSendMessage).toHaveBeenCalledWith(123, expect.stringContaining('Webhook Notifications Setup'));
    });

    it('should use custom configuration message when provided', async () => {
      const customMessage = 'Custom setup instructions: {{WEBHOOK_URL}}';
      const bot = new Bot('test-token', parser, customMessage);
      bot.sendMessage = mockSendMessage;

      const startUpdate = {
        update_id: 1,
        message: {
          message_id: 1,
          date: Date.now(),
          chat: { id: 456, type: 'private' as const },
          text: '/start'
        }
      } as any;

      await bot.processUpdate(startUpdate, 'https://example.com');

      expect(mockSendMessage).toHaveBeenCalledWith(456, 'Custom setup instructions: https://example\\.com/send\\-notifications/456');
    });

    it('should not send message for non-start updates', async () => {
      const bot = new Bot('test-token', parser);
      bot.sendMessage = mockSendMessage;

      const regularUpdate = {
        update_id: 1,
        message: {
          message_id: 1,
          date: Date.now(),
          chat: { id: 123, type: 'private' as const },
          text: 'regular message'
        }
      } as any;

      await bot.processUpdate(regularUpdate, 'https://test.com');

      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });
});
