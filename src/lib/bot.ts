import { Update, Message as TypegramMessage } from 'typegram';
import { TelegramClient } from 'messaging-api-telegram';
import { ParseMode, Message } from 'messaging-api-telegram/dist/TelegramTypes';
import { configurationMessage } from './templates';
import { MessageParser } from './message-parsers/types';

export class Bot {
  private client: TelegramClient;
  private parser: MessageParser;

  constructor(accessToken: string, parser: MessageParser) {
    if (!accessToken) throw new Error('Access token undefined');

    this.client = new TelegramClient({
      accessToken,
    });

    this.parser = parser;
  }

  async processUpdate(update: Update, baseUrl: string) {
    if (
      isMessageUpdate(update) &&
      'text' in update.message &&
      update.message.text &&
      update.message.text.toLowerCase() === '/configure'
    ) {
      await this.sendMessage(
        update.message.chat.id,
        configurationMessage(update.message.chat.id, baseUrl)
      );
    }
  }

  async sendMessage(chatId: number, text: string): Promise<Message> {
    return await this.client.sendMessage(chatId, text, {
      parseMode: ParseMode.HTML,
    });
  }

  parseMessage(message: object) {
    return this.parser.parse(message);
  }
}

function isMessageUpdate(update: Update): update is Update.MessageUpdate {
  return 'message' in update;
}
