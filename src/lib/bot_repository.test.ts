import { getBotInstanceById } from './bot_repository';

describe('Bot Repository', () => {
  const mockEnv = {
    BOT_CONFIG: {
      get: jest.fn(),
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBotInstanceById', () => {
    it('should return bot instance from KV storage', async () => {
      const mockBotConfig = {
        token: 'test-bot-token',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockEnv.BOT_CONFIG.get.mockResolvedValue(JSON.stringify(mockBotConfig));

      const bot = await getBotInstanceById('test-bot', mockEnv);

      expect(bot).toBeDefined();
      expect(mockEnv.BOT_CONFIG.get).toHaveBeenCalledWith('test-bot');
    });

    it('should throw error if bot configuration not found', async () => {
      mockEnv.BOT_CONFIG.get.mockResolvedValue(null);

      await expect(getBotInstanceById('nonexistent', mockEnv)).rejects.toThrow(
        'Bot configuration not found for ID: nonexistent'
      );
    });

    it('should throw error if bot configuration has no token', async () => {
      const mockBotConfig = {
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockEnv.BOT_CONFIG.get.mockResolvedValue(JSON.stringify(mockBotConfig));

      await expect(getBotInstanceById('invalid-bot', mockEnv)).rejects.toThrow(
        'Bot token not found for ID: invalid-bot'
      );
    });

    it('should cache bot instances', async () => {
      const mockBotConfig = {
        token: 'test-bot-token',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      mockEnv.BOT_CONFIG.get.mockResolvedValue(JSON.stringify(mockBotConfig));

      const bot1 = await getBotInstanceById('test-bot', mockEnv);
      const bot2 = await getBotInstanceById('test-bot', mockEnv);

      expect(bot1).toBe(bot2);
      expect(mockEnv.BOT_CONFIG.get).toHaveBeenCalledTimes(1);
    });
  });
}); 