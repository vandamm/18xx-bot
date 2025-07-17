import { Message } from 'typegram';

export class TelegramClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string) {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async sendMessage(chatId: number, text: string, options: { parseMode?: string } = {}): Promise<Message> {
    const url = `${this.baseUrl}/sendMessage`;
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: options.parseMode || 'HTML'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json() as { ok: boolean; result: Message };
    if (!result.ok) {
      throw new Error('Telegram API request failed');
    }

    return result.result;
  }
}