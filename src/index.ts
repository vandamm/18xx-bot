import { handleMultiBotProcessUpdates } from './routes/multi-bot-process-updates';
import { handleMultiBotSendNotifications } from './routes/multi-bot-send-notifications';
import { Env } from './types';

const LEGACY_BOT_ID = '18xx.games';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    console.log({
      message: 'Incoming request',
      request,
    })
    
    if (request.method === 'POST') {
      const legacyProcessUpdatesMatch = url.pathname === '/process-updates';
      if (legacyProcessUpdatesMatch) {
        return handleMultiBotProcessUpdates(request, env, LEGACY_BOT_ID);
      }
      
      const legacySendNotificationsMatch = url.pathname.match(/^\/send-notifications\/(.+)$/);
      if (legacySendNotificationsMatch) {
        const chatId = parseInt(legacySendNotificationsMatch[1]);
        return handleMultiBotSendNotifications(request, env, LEGACY_BOT_ID, chatId);
      }
      
      const newBotProcessUpdatesMatch = url.pathname.match(/^\/([^\/]+)\/process-updates$/);
      if (newBotProcessUpdatesMatch) {
        const botId = newBotProcessUpdatesMatch[1];
        return handleMultiBotProcessUpdates(request, env, botId);
      }
      
      const newBotNotificationsMatch = url.pathname.match(/^\/([^\/]+)\/?(.*)$/);
      if (newBotNotificationsMatch) {
        const botId = newBotNotificationsMatch[1];
        const chatId = newBotNotificationsMatch[2] ? parseInt(newBotNotificationsMatch[2]) : undefined;
        return handleMultiBotSendNotifications(request, env, botId, chatId);
      }
    }
    
    return new Response('Not Found', { status: 404 });
  },
};

 