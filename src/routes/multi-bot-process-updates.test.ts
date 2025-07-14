import { handleMultiBotProcessUpdates } from './multi-bot-process-updates';

describe('handleMultiBotProcessUpdates', () => {
  const mockEnv = {
    TELEGRAM_BOT_18XX: 'test-token',
    BOT_CONFIG: {
      get: jest.fn(),
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process update successfully', async () => {
    const mockUpdate = {
      update_id: 123,
      message: {
        message_id: 456,
        date: 1234567890,
        chat: { id: 789, type: 'private' },
        text: 'test message',
      },
    };

    const mockRequest = {
      url: 'https://test.example.com/18xx.games/process-updates',
      json: jest.fn().mockResolvedValue(mockUpdate),
    } as any;

    const mockBot = {
      processUpdate: jest.fn(),
    };

    mockEnv.BOT_CONFIG.get.mockResolvedValue(JSON.stringify({
      token: 'test-bot-token',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }));

    jest.mock('../lib/bot_repository', () => ({
      getBotInstanceById: jest.fn().mockResolvedValue(mockBot),
    }));

    const response = await handleMultiBotProcessUpdates(mockRequest, mockEnv, '18xx.games');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
  });

  it('should handle errors', async () => {
    const mockRequest = {
      url: 'https://test.example.com/18xx.games/process-updates',
      json: jest.fn().mockRejectedValue(new Error('Test error')),
    } as any;

    const response = await handleMultiBotProcessUpdates(mockRequest, mockEnv, '18xx.games');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Test error');
  });

  it('should handle bot not found', async () => {
    const mockRequest = {
      url: 'https://test.example.com/nonexistent/process-updates',
      json: jest.fn().mockResolvedValue({}),
    } as any;

    mockEnv.BOT_CONFIG.get.mockResolvedValue(null);

    const response = await handleMultiBotProcessUpdates(mockRequest, mockEnv, 'nonexistent');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Bot configuration not found for ID: nonexistent');
  });

  it('should handle invalid bot configuration', async () => {
    const mockRequest = {
      url: 'https://test.example.com/invalid/process-updates',
      json: jest.fn().mockResolvedValue({}),
    } as any;

    mockEnv.BOT_CONFIG.get.mockResolvedValue(JSON.stringify({
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }));

    const response = await handleMultiBotProcessUpdates(mockRequest, mockEnv, 'invalid');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Bot token not found for ID: invalid');
  });

  it('should construct correct base URL', async () => {
    const mockUpdate = {
      update_id: 123,
      message: {
        message_id: 456,
        date: 1234567890,
        chat: { id: 789, type: 'private' },
        text: 'test message',
      },
    };

    const mockRequest = {
      url: 'https://ping.vansach.me/18xx.games/process-updates',
      json: jest.fn().mockResolvedValue(mockUpdate),
    } as any;

    const mockBot = {
      processUpdate: jest.fn(),
    };

    mockEnv.BOT_CONFIG.get.mockResolvedValue(JSON.stringify({
      token: 'test-bot-token',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }));

    jest.mock('../lib/bot_repository', () => ({
      getBotInstanceById: jest.fn().mockResolvedValue(mockBot),
    }));

    await handleMultiBotProcessUpdates(mockRequest, mockEnv, '18xx.games');

    expect(mockBot.processUpdate).toHaveBeenCalledWith(
      mockUpdate,
      'https://ping.vansach.me'
    );
  });
}); 