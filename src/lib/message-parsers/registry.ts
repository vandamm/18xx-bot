import { MessageParser } from './types';
import { DefaultParser } from './default-parser';
import { EighteenxxParser } from './18xx-parser';

class ParserRegistry {
  private parsers = new Map<string, MessageParser>();

  constructor() {
    this.register(new DefaultParser());
    this.register(new EighteenxxParser());
  }

  register(parser: MessageParser): void {
    this.parsers.set(parser.name, parser);
  }

  get(name: string): MessageParser {
    return this.parsers.get(name) || this.parsers.get('default')!;
  }

  list(): string[] {
    return Array.from(this.parsers.keys());
  }
}

export const parserRegistry = new ParserRegistry(); 