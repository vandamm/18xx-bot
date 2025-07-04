import { Update, Message as TypegramMessage } from 'typegram';
import { TelegramClient } from 'messaging-api-telegram';
import { ParseMode, Message } from 'messaging-api-telegram/dist/TelegramTypes';
import { configurationMessage } from './templates';

export class Bot {
  private client: TelegramClient;

  constructor(accessToken: string, origin: string = '') {
    if (!accessToken) throw new Error('Access token undefined');

    this.client = new TelegramClient({
      accessToken,
      origin,
    });
  }

  async processUpdate(update: Update, baseUrl: string) {
    if (
      isMessageUpdate(update) &&
      (<TypegramMessage.TextMessage>update.message).text === '/start'
    ) {
      const chatId = update.message.chat.id;

      await this.client.sendMessage(chatId, configurationMessage(chatId, baseUrl), {
        parseMode: ParseMode.Markdown,
      });
    }
  }

  async sendMessage(chatId: number, text: string): Promise<Message> {
    return await this.client.sendMessage(chatId, text, {
      parseMode: ParseMode.Markdown,
    });
  }
}

function isMessageUpdate(update: Update): update is Update.MessageUpdate {
  return (update as Update.MessageUpdate).message !== undefined;
}
