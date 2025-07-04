import { Bot } from './bot';

const BOT_SECRET_NAME = 'TELEGRAM_BOT_18XX';

let instance: Bot;

export async function getBotInstance(env: any): Promise<Bot> {
  if (instance) return instance;

  const secret = env[BOT_SECRET_NAME];
  if (!secret) {
    throw new Error(`Secret ${BOT_SECRET_NAME} not found in environment`);
  }

  instance = new Bot(secret);

  return instance;
}
