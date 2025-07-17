import { getBotInstanceById } from '../lib/bot_repository';
import { notificationMessage } from '../lib/templates';
import { Env } from '../types';
import { ParsedMessage } from '../lib/message-parsers/types';

function resolveChatId(routeChatId?: number, parsedMessage?: ParsedMessage): number|undefined {
  if (routeChatId && !isNaN(routeChatId)) {
    return routeChatId;
  }

  if (parsedMessage?.metadata?.userId) {
    const userIdFromMessage = parseInt(parsedMessage.metadata.userId);
    if (!isNaN(userIdFromMessage)) {
      return userIdFromMessage;
    }
  }

  return undefined;
}

async function parseRequestBody(request: Request): Promise<object> {
  try {
    return await request.json();
  } catch (error) {
    // If JSON parsing fails, treat the entire body as plain text
    const text = await request.text();
    return { text };
  }
}

export async function handleMultiBotSendNotifications(request: Request, env: Env, botId: string, chatId?: number): Promise<Response> {
  try {
    const bot = await getBotInstanceById(botId, env);
    if (!bot) {
      return new Response('Not found', { status: 404 });
    }

    const body = await parseRequestBody(request);
    const parsedMessage = bot.parseMessage(body as object);

    console.log({
      message: 'Notification',
      botId,
      chatId,
      body,
      parsedMessage,
    })

    if (!parsedMessage.valid) {
      return new Response('Message has invalid format', { status: 422 });
    }

    const targetChatId = resolveChatId(chatId, parsedMessage);
    if (!targetChatId) {
      return new Response('Invalid chat ID', { status: 400 });
    }

    const messageText = parsedMessage.link 
      ? notificationMessage(parsedMessage.content, parsedMessage.link)
      : parsedMessage.content;

    await bot.sendMessage(targetChatId, messageText);

    return new Response('OK', { status: 200 });
  } catch (e) {
    const error = e as Error;
    
    console.error({
      message: 'Error sending notification',
      chatId,
      botId,
      error: error.message,
      stack: error.stack,
    });

    return new Response('Internal server error', { status: 500 });
  }
} 