import { Update } from 'typegram';
import { TelegramClient } from 'messaging-api-telegram';
import { ParseMode } from 'messaging-api-telegram/dist/TelegramTypes';

export interface Incoming18xxMessage {
  text: string;
}

interface ParsedMessage {
  chatId: number;
  text: string;
  link: string;
}

export class Bot {
  private client: TelegramClient;
  private pattern: RegExp =
    /<@(?<chatId>.*)> (?<message>.+ in \w+ ".*" \(.*\))\n(?<link>.*)/g;

  constructor(accessToken: string, origin: string = '') {
    if (!accessToken) throw new Error('Access token undefined');

    this.client = new TelegramClient({
      accessToken,
      origin,
    });
  }

  async processUpdate(update: Update) {
    if (isMessageUpdate(update)) {
      const chatId = update.message.chat.id;

      await this.client.sendMessage(chatId, this.configurationMessage(chatId), {
        parseMode: ParseMode.Markdown,
      });
    }
  }

  async notifyUser(message: Incoming18xxMessage) {
    const parsed = this.parseMessage(message);

    await this.client.sendMessage(
      parsed.chatId,
      this.notificationMessage(parsed),
      { parseMode: ParseMode.Markdown }
    );
  }

  private parseMessage(message: Incoming18xxMessage): ParsedMessage {
    const match = this.pattern.exec(message.text);

    if (!match) return;

    const chatId = parseInt(match.groups.chatId);
    const { text, link } = match.groups;

    return { chatId, text, link };
  }

  private configurationMessage(chatId: number): string {
    const { WEBHOOK_URL_18XX } = process.env;

    if (!WEBHOOK_URL_18XX) throw new Error('WEBHOOK_URL_18XX is undefined');

    return `Use these values on [18xx.games profile page](https://18xx.games/profile):

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: \`${WEBHOOK_URL_18XX}\`
*Webhook User ID*: \`${chatId.toString()}\``;
  }

  private notificationMessage(message: ParsedMessage): string {
    return `${message.text}
[${message.link}](${message.link})`;
  }
}

function isMessageUpdate(update: Update): update is Update.MessageUpdate {
  return (update as Update.MessageUpdate).message !== undefined;
}
