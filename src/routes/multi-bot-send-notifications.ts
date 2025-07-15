import { getBotInstanceById } from '../lib/bot_repository';
import { notificationMessage } from '../lib/templates';
import { Env } from '../types';

export async function handleMultiBotSendNotifications(request: Request, env: Env, botId: string, chatId: number): Promise<Response> {
  if (isNaN(chatId)) {
    return new Response('Invalid input', { status: 400 });
  }

  try {
    const body = await request.json();
    const bot = await getBotInstanceById(botId, env);
    
    const parsedMessage = bot.parseMessage(body as object);

    console.log({
      event: 'Notification',
      botId,
      chatId,
      body,
      parsedMessage,
    })

    if (!parsedMessage.valid) {
      return new Response('Message has invalid format', { status: 422 });
    }

    const messageText = parsedMessage.link 
      ? notificationMessage(parsedMessage.content, parsedMessage.link)
      : parsedMessage.content;

    await bot.sendMessage(chatId, messageText);

    return new Response('OK', { status: 200 });
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, { status: 500 });
  }
} 