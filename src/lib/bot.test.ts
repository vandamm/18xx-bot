import { Bot } from './bot';
import { DefaultParser } from './message-parsers/default-parser';
import { TelegramClient } from 'messaging-api-telegram';

jest.mock('messaging-api-telegram');

describe('Bot', () => {
  let mockParser: DefaultParser;
  
  beforeEach(() => {
    mockParser = new DefaultParser();
    jest.clearAllMocks();
  });

  it('should throw error for empty access token', () => {
    expect(() => new Bot('', mockParser)).toThrowError('Access token undefined');
  });

  it('should create Telegram client with access token', () => {
    const bot = new Bot('token', mockParser);
    
    expect(TelegramClient).toHaveBeenCalledWith({
      accessToken: 'token',
    });
  });

  it('should send message via client', async () => {
    const mockSendMessage = jest.fn();
    (TelegramClient as any).mockImplementation(() => ({
      sendMessage: mockSendMessage,
    }));

    const bot = new Bot('token', mockParser);
    await bot.sendMessage(123, 'test message');

    expect(mockSendMessage).toHaveBeenCalledWith(123, 'test message', {
      parseMode: 'HTML',
    });
  });

  it('should use configured parser to parse messages', () => {
    const bot = new Bot('token', mockParser);
    const message = { text: 'test message' };
    
    const result = bot.parseMessage(message);
    
    expect(result.valid).toBe(true);
    expect(result.content).toBe('test message');
  });
});
