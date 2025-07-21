import { Update, Message } from 'typegram';
import { processConfigurationMessage, DEFAULT_CONFIGURATION_MESSAGE } from './templates';
import { MessageParser } from './message-parsers/types';
import { TelegramClient } from './telegram_client';

export class Bot {
  private client: TelegramClient;
  private parser: MessageParser;
  private configurationMessage: string;

  constructor(accessToken: string, parser: MessageParser, configurationMessage: string = DEFAULT_CONFIGURATION_MESSAGE) {
    if (!accessToken) throw new Error('Access token undefined');

    this.client = new TelegramClient(accessToken);
    this.parser = parser;
    this.configurationMessage = configurationMessage;
  }

  async processUpdate(update: Update, baseUrl: string) {
    if (isStartMessage(update)) {
      const template = this.configurationMessage;
      const message = processConfigurationMessage(template, update.message.chat.id, baseUrl);
      
      await this.sendMessage(update.message.chat.id, message);
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
