import { Update } from 'typegram';
import { getBotInstance } from '../lib/bot_repository';

export async function handleProcessUpdates(request: Request, env: any): Promise<Response> {
  try {
    const update = await request.json() as Update;
    const bot = await getBotInstance(env);

    await bot.processUpdate(update, env.WEBHOOK_URL_18XX);

    return new Response('OK', { status: 200 });
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, { status: 500 });
  }
} 