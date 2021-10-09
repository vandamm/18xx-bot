import { Injectable } from '@nestjs/common';

import { Update, Message as TypegramMessage } from 'typegram';
import { TelegramClient } from 'messaging-api-telegram';
import { ParseMode, Message } from 'messaging-api-telegram/dist/TelegramTypes';
import { configurationMessage } from './common/templates';

@Injectable()
export class BotService {
  private instance: TelegramClient;

  private get client(): TelegramClient {
    if (!this.instance) {
      const accessToken = process.env.TELEGRAM_BOT_SECRET; // FIXME: replace with config

      if (!accessToken) throw new Error('Access token undefined');

      this.instance = new TelegramClient({
        accessToken,
        origin,
      });
    }

    return this.instance;
  }

  async processUpdate(update: Update) {
    if (!isMessageUpdate(update)) return;

    if ((<TypegramMessage.TextMessage>update.message).text === '/start') {
      const chatId = update.message.chat.id;

      await this.client.sendMessage(chatId, configurationMessage(chatId), {
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
  return (<Update.MessageUpdate>update).message !== undefined;
}
