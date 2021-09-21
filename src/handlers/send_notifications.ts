import { Bot } from '../lib/bot.js';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Parsed18xxMessage } from '../lib/18xx_message.js';
import { notificationMessage } from '../lib/templates.js';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event', event);

  try {
    const message = new Parsed18xxMessage(JSON.parse(event.body));

    await bot.sendMessage(
      message.chatId,
      notificationMessage(message.text, message.link)
    );

    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    };
  }
};
