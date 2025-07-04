import { handleProcessUpdates } from './handlers/process_updates';
import { handleSendNotifications } from './handlers/send_notifications';

export interface Env {
  TELEGRAM_BOT_18XX: string;
  WEBHOOK_URL_18XX: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    if (request.method === 'POST' && url.pathname === '/process-updates') {
      return handleProcessUpdates(request, env);
    }
    
    const sendNotificationsMatch = url.pathname.match(/^\/send-notifications\/(.+)$/);
    if (request.method === 'POST' && sendNotificationsMatch) {
      const chatId = parseInt(sendNotificationsMatch[1]);
      return handleSendNotifications(request, env, chatId);
    }
    
    return new Response('Not Found', { status: 404 });
  },
};

 