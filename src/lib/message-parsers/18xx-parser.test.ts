import { EighteenxxParser } from './18xx-parser';

describe('EighteenxxParser', () => {
  let parser: EighteenxxParser;

  beforeEach(() => {
    parser = new EighteenxxParser();
  });

  it('should have correct name', () => {
    expect(parser.name).toBe('18xx');
  });

  it('should parse valid 18xx message', () => {
    const message = {
      text: '<@U123456> has started their turn in 1830 "Testing Game" (Operating Round 2)\nhttps://18xx.games/game/12345'
    };

    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('has started their turn in 1830 "Testing Game" (Operating Round 2)');
    expect(result.link).toBe('https://18xx.games/game/12345');
    expect(result.metadata?.userId).toBe('U123456');
    expect(result.metadata?.title).toBe('1830');
    expect(result.metadata?.description).toBe('Testing Game');
    expect(result.metadata?.round).toBe('Operating Round');
    expect(result.metadata?.turn).toBe(2);
  });

  it('should reject invalid message format', () => {
    const message = { data: 'not a valid 18xx message' };
    const result = parser.parse(message);

    expect(result.valid).toBe(false);
    expect(result.content).toBe('Invalid message format');
  });

  it('should reject message without text field', () => {
    const message = { content: 'some content' };
    const result = parser.parse(message);

    expect(result.valid).toBe(false);
    expect(result.content).toBe('Invalid message format');
  });

  it('should reject message with wrong text pattern', () => {
    const message = { text: 'This is not a 18xx.games message' };
    const result = parser.parse(message);

    expect(result.valid).toBe(false);
    expect(result.content).toBe('Message format not recognized');
  });

  it('should handle turn numbers correctly', () => {
    const message = {
      text: '<@U789> completed turn in 1889 "Long Game" (Stock Round 15)\nhttps://18xx.games/game/67890'
    };

    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.metadata?.turn).toBe(15);
  });
}); 