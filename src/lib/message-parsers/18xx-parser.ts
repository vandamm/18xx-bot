import { MessageParser, ParsedMessage } from './types';

interface Incoming18xxMessage {
  text: string;
}

const MESSAGE_PATTERN =
  /<@(?<userId>.*)> (?<text>.+) in (?<title>.+) "(?<description>.*)" \((?<round>.*) (?<turn>\d+)\)\n(?<link>.*)/;

export class EighteenxxParser implements MessageParser {
  name = '18xx';

  parse(message: object): ParsedMessage {
    if (!this.isValidMessage(message)) {
      return {
        content: 'Invalid message format',
        valid: false
      };
    }

    const match = message.text.match(MESSAGE_PATTERN);

    if (!match) {
      return {
        content: 'Message format not recognized',
        valid: false
      };
    }

    const { userId, text, title, description, round, turn, link } = match.groups!;

    const content = this.formatMessage({
      text,
      title,
      description,
      round,
      turn: parseInt(turn)
    });

    return {
      content,
      link,
      valid: true,
      metadata: {
        userId,
        text,
        title,
        description,
        round,
        turn: parseInt(turn),
        originalMessage: message
      }
    };
  }

  private isValidMessage(message: any): message is Incoming18xxMessage {
    return message && typeof message.text === 'string';
  }

  private formatMessage(data: {
    text: string;
    title: string;
    description: string;
    round: string;
    turn: number;
  }): string {
    return `${data.text} in ${data.title} "${data.description}" (${data.round} ${data.turn})`;
  }
} 