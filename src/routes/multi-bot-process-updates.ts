import { Update } from 'typegram';
import { getBotInstanceById } from '../lib/bot_repository';
import { Env } from '../types';

export async function handleMultiBotProcessUpdates(request: Request, env: Env, botId: string): Promise<Response> {
  try {
    const update = await request.json() as Update;
    const bot = await getBotInstanceById(botId, env);

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    await bot.processUpdate(update, baseUrl);

    return new Response('OK', { status: 200 });
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, { status: 500 });
  }
} 