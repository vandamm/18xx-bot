import { APIGatewayProxyHandler } from 'aws-lambda';
import { Parsed18xxMessage } from '../lib/18xx_message';
import { getBotInstance } from '../lib/bot_repository';
import { notificationMessage } from '../lib/templates';

export const handler: APIGatewayProxyHandler = async (event) => {
  const chatId = parseInt(event.pathParameters?.chatId);

  if (isNaN(chatId)) return { statusCode: 400, body: 'Invalid input' };

  try {
    const message = new Parsed18xxMessage(JSON.parse(event.body));

    if (!message.valid)
      return {
        statusCode: 422,
        body: 'Message has invalid format',
      };

    const bot = await getBotInstance();

    await bot.sendMessage(
      chatId,
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
