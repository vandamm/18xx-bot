import { Bot } from '../lib/bot';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Parsed18xxMessage } from '../lib/18xx_message';
import { notificationMessage } from '../lib/templates';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event', event);

  try {
    const message = new Parsed18xxMessage(JSON.parse(event.body));

    if (!message.valid)
      return {
        statusCode: 422,
        body: 'Message has invalid format',
      };

    await bot.sendMessage(
      parseInt(message.userId),
      notificationMessage(message.toString(), message.link)
    );

    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message,
    };
  }
};
