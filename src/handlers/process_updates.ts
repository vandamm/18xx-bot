import { APIGatewayProxyHandler } from 'aws-lambda';
import { Update } from 'typegram';
import { Bot } from '../lib/bot.js';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event', event);

  try {
    await bot.processUpdate(JSON.parse(event.body) as Update);

    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return {
      body: e.message,
      statusCode: 500,
    };
  }
};
