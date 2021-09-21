import { Bot, Incoming18xxMessage } from '../lib/bot.js';
import { APIGatewayProxyHandler } from 'aws-lambda';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event', event);

  try {
    await bot.notifyUser(JSON.parse(event.body) as Incoming18xxMessage);

    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    };
  }
};
