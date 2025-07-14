import { DefaultParser } from './default-parser';

describe('DefaultParser', () => {
  let parser: DefaultParser;

  beforeEach(() => {
    parser = new DefaultParser();
  });

  it('should have correct name', () => {
    expect(parser.name).toBe('default');
  });

  it('should parse text field', () => {
    const message = { text: 'Hello world' };
    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('Hello world');
    expect(result.link).toBeUndefined();
    expect(result.metadata?.originalMessage).toBe(message);
  });

  it('should parse content field', () => {
    const message = { content: 'Test content' };
    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('Test content');
  });

  it('should parse message field', () => {
    const message = { message: 'Test message' };
    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('Test message');
  });

  it('should parse link field', () => {
    const message = { text: 'Hello', link: 'https://example.com' };
    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('Hello');
    expect(result.link).toBe('https://example.com');
  });

  it('should parse url field as link', () => {
    const message = { text: 'Hello', url: 'https://example.com' };
    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('Hello');
    expect(result.link).toBe('https://example.com');
  });

  it('should stringify object when no text fields found', () => {
    const message = { data: 'value', number: 42 };
    const result = parser.parse(message);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('{"data":"value","number":42}');
  });

  it('should handle non-object input', () => {
    const result = parser.parse('simple string' as any);

    expect(result.valid).toBe(true);
    expect(result.content).toBe('simple string');
  });
}); 