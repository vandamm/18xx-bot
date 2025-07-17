import { Update, Message } from 'typegram';
import { configurationMessage } from './templates';
import { MessageParser } from './message-parsers/types';
import { TelegramClient } from './telegram_client';

export class Bot {
  private client: TelegramClient;
  private parser: MessageParser;

  constructor(accessToken: string, parser: MessageParser) {
    if (!accessToken) throw new Error('Access token undefined');

    this.client = new TelegramClient(accessToken);
    this.parser = parser;
  }

  async processUpdate(update: Update, baseUrl: string) {
    if (isStartMessage(update)) {
      await this.sendMessage(
        update.message.chat.id,
        configurationMessage(update.message.chat.id, baseUrl)
      );
    }
  }

  async sendMessage(chatId: number, text: string): Promise<Message> {
    return await this.client.sendMessage(chatId, text, {
      parseMode: 'HTML',
    });
  }

  parseMessage(message: object) {
    return this.parser.parse(message);
  }
}

function isStartMessage(update: Update): update is Update.MessageUpdate {
  return 'message' in update &&
    'text' in update.message &&
    update.message.text &&
    update.message.text.toLowerCase() === '/start';
}
