import { APIGatewayProxyHandler } from 'aws-lambda';
import { Update } from 'typegram';
import { getBotInstance } from '../lib/bot_repository';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const update = JSON.parse(event.body) as Update;
    const bot = await getBotInstance();

    await bot.processUpdate(update);

    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return {
      body: e.message,
      statusCode: 500,
    };
  }
};
