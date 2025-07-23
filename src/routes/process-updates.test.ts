import { handleProcessUpdates } from './process-updates';

jest.mock('../lib/bot_repository');

import { getBotInstanceById } from '../lib/bot_repository';

describe('handleProcessUpdates', () => {
  const mockGetBotInstanceById = getBotInstanceById as jest.MockedFunction<typeof getBotInstanceById>;
  
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

    mockGetBotInstanceById.mockResolvedValue(mockBot as any);

    const response = await handleProcessUpdates(mockRequest, mockEnv, '18xx.games');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
  });

  it('should handle errors', async () => {
    const mockRequest = {
      url: 'https://test.example.com/18xx.games/process-updates',
      json: jest.fn().mockRejectedValue(new Error('Test error')),
    } as any;

    const response = await handleProcessUpdates(mockRequest, mockEnv, '18xx.games');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error');
  });

  it('should handle bot not found', async () => {
    const mockRequest = {
      url: 'https://test.example.com/nonexistent/process-updates',
      json: jest.fn().mockResolvedValue({}),
    } as any;

    mockGetBotInstanceById.mockRejectedValue(new Error('Bot configuration not found for ID: nonexistent'));

    const response = await handleProcessUpdates(mockRequest, mockEnv, 'nonexistent');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error');
  });

  it('should handle invalid bot configuration', async () => {
    const mockRequest = {
      url: 'https://test.example.com/invalid/process-updates',
      json: jest.fn().mockResolvedValue({}),
    } as any;

    mockGetBotInstanceById.mockRejectedValue(new Error('Bot token not found for ID: invalid'));

    const response = await handleProcessUpdates(mockRequest, mockEnv, 'invalid');

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Internal server error');
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

    mockGetBotInstanceById.mockResolvedValue(mockBot as any);

    await handleProcessUpdates(mockRequest, mockEnv, '18xx.games');

    expect(mockBot.processUpdate).toHaveBeenCalledWith(
      mockUpdate,
      'https://ping.vansach.me'
    );
  });
}); 
