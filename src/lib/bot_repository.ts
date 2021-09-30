import { getSecret } from './get_secret';
import { Bot } from './bot';

const BOT_SECRET_NAME = 'TELEGRAM_BOT_18XX';

let instance: Bot;

export async function getBotInstance(): Promise<Bot> {
  if (instance) return instance;

  const secret = await getSecret(BOT_SECRET_NAME);

  if (!secret) throw new Error('Secret not defined ' + BOT_SECRET_NAME);

  instance = new Bot(secret);

  return instance;
}
