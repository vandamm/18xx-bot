export interface Env {
  BOT_CONFIG: KVNamespace;
}

export interface BotConfig {
  token: string;
  parser?: string;
  createdAt: string;
  updatedAt: string;
} 