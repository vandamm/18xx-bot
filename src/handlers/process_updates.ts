import { Update } from 'typegram';
import { getBotInstance } from '../lib/bot_repository';

export async function handleProcessUpdates(request: Request, env: any): Promise<Response> {
  try {
    const update = await request.json() as Update;
    const bot = await getBotInstance(env);

    // Dynamically determine the base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    await bot.processUpdate(update, baseUrl);

    return new Response('OK', { status: 200 });
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, { status: 500 });
  }
} 