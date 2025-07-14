import { MessageParser, ParsedMessage } from './types';

export class DefaultParser implements MessageParser {
  name = 'default';

  parse(message: object): ParsedMessage {
    let content: string;
    let link: string | undefined;

    if (typeof message === 'object' && message !== null) {
      const msg = message as any;
      
      if (typeof msg.text === 'string') {
        content = msg.text;
      } else if (typeof msg.content === 'string') {
        content = msg.content;
      } else if (typeof msg.message === 'string') {
        content = msg.message;
      } else {
        content = JSON.stringify(message);
      }

      if (typeof msg.link === 'string') {
        link = msg.link;
      } else if (typeof msg.url === 'string') {
        link = msg.url;
      }
    } else {
      content = String(message);
    }

    return {
      content,
      link,
      valid: true,
      metadata: { originalMessage: message }
    };
  }
} 