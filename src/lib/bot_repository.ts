import { Bot } from './bot';
import { Env, BotConfig } from '../types';
import { parserRegistry } from './message-parsers/registry';

const botInstances = new Map<string, Bot>();

export async function getBotInstanceById(botId: string, env: Env): Promise<Bot> {
  if (botInstances.has(botId)) {
    return botInstances.get(botId)!;
  }

  const botConfigJson = await env.BOT_CONFIG.get(botId);
  if (!botConfigJson) {
    throw new Error(`Bot configuration not found for ID: ${botId}`);
  }

  const config: BotConfig = JSON.parse(botConfigJson);
  if (!config.token) {
    throw new Error(`Bot token not found for ID: ${botId}`);
  }

  const parser = parserRegistry.get(config.parser || 'default');
  const bot = new Bot(config.token, parser);
  botInstances.set(botId, bot);

  return bot;
}


