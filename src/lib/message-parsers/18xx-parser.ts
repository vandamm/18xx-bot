import { MessageParser, ParsedMessage } from './types';

interface Incoming18xxMessage {
  text: string;
}

const GAME_MESSAGE_PATTERN =
  /<@(?<userId>.*)> (?<text>.+) in (?<title>.+) "(?<description>.*)" \((?<round>.*) (?<turn>\d+)\)\n(?<link>.*)/;

const NOTIFICATION_MESSAGE_PATTERN =
  /<@(?<userId>\d+)> (?<text>.*from 18xx\.games\.?)$/;

export class EighteenxxParser implements MessageParser {
  name = '18xx';

  parse(message: object): ParsedMessage {
    if (!this.isValidMessage(message)) {
      return {
        content: 'Invalid message format',
        valid: false
      };
    }

    // Try to match the complex game message format first
    const gameMatch = message.text.match(GAME_MESSAGE_PATTERN);
    if (gameMatch) {
      return this.parseGameMessage(gameMatch, message);
    }

    // Try to match the simple notification format
    const notificationMatch = message.text.match(NOTIFICATION_MESSAGE_PATTERN);
    if (notificationMatch) {
      return this.parseNotificationMessage(notificationMatch, message);
    }

    return {
      content: 'Message format not recognized',
      valid: false
    };
  }

  private parseGameMessage(match: RegExpMatchArray, originalMessage: object): ParsedMessage {
    const { userId, text, title, description, round, turn, link } = match.groups!;

    const content = this.formatGameMessage({
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
        messageType: 'game',
        originalMessage
      }
    };
  }

  private parseNotificationMessage(match: RegExpMatchArray, originalMessage: object): ParsedMessage {
    const { userId, text } = match.groups!;

    return {
      content: text,
      valid: true,
      metadata: {
        userId,
        text,
        messageType: 'notification',
        originalMessage
      }
    };
  }

  private isValidMessage(message: any): message is Incoming18xxMessage {
    return message && typeof message.text === 'string';
  }

  private formatGameMessage(data: {
    text: string;
    title: string;
    description: string;
    round: string;
    turn: number;
  }): string {
    return `${data.text} in ${data.title} "${data.description}" (${data.round} ${data.turn})`;
  }
} 