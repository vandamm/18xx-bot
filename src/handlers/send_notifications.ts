import { Parsed18xxMessage } from '../lib/18xx_message';
import { getBotInstance } from '../lib/bot_repository';
import { notificationMessage } from '../lib/templates';

export async function handleSendNotifications(request: Request, env: any, chatId: number): Promise<Response> {
  if (isNaN(chatId)) {
    return new Response('Invalid input', { status: 400 });
  }

  try {
    const body = await request.json();
    const message = new Parsed18xxMessage(body as object);

    if (!message.valid) {
      return new Response('Message has invalid format', { status: 422 });
    }

    const bot = await getBotInstance(env);

    await bot.sendMessage(
      chatId,
      notificationMessage(message.toString(), message.link)
    );

    return new Response('OK', { status: 200 });
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, { status: 500 });
  }
} 