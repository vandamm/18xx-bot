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
});
