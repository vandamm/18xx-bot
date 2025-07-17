export interface ParsedMessage {
  content: string;
  link?: string;
  valid: boolean;
  metadata?: Record<string, any>;
}

export interface MessageParser {
  parse(message: object): ParsedMessage;
  name: string;
} 