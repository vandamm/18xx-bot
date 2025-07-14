import { handleMultiBotSendNotifications } from './multi-bot-send-notifications';

jest.mock('../lib/bot_repository');

import { getBotInstanceById } from '../lib/bot_repository';

describe('handleMultiBotSendNotifications', () => {
  const mockGetBotInstanceById = getBotInstanceById as jest.MockedFunction<typeof getBotInstanceById>;
  
  const mockEnv = {
    BOT_CONFIG: {
      get: jest.fn(),
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send notification successfully', async () => {
    const mockMessageBody = {
      game: '1830',
      action: 'turn_completed',
      player: 'John',
      link: 'https://example.com/game/123',
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockMessageBody),
    } as any;

    const mockBot = {
      sendMessage: jest.fn(),
      processUpdate: jest.fn(),
      parseMessage: jest.fn().mockReturnValue({
        content: '1830 turn completed by John',
        link: 'https://example.com/game/123',
        valid: true
      })
    } as any;

    mockGetBotInstanceById.mockResolvedValue(mockBot);

    const response = await handleMultiBotSendNotifications(mockRequest, mockEnv, '18xx.games', 123456789);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
    expect(mockBot.parseMessage).toHaveBeenCalledWith(mockMessageBody);
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      123456789,
      expect.stringContaining('1830')
    );
  });

  it('should handle invalid chat ID', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({}),
    } as any;

    const response = await handleMultiBotSendNotifications(mockRequest, mockEnv, '18xx.games', NaN);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid input');
  });

  it('should handle invalid message format', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({}),
    } as any;

    const mockBot = {
      sendMessage: jest.fn(),
      processUpdate: jest.fn(),
      parseMessage: jest.fn().mockReturnValue({
        content: 'Invalid format',
        valid: false
      })
    } as any;

    mockGetBotInstanceById.mockResolvedValue(mockBot);

    const response = await handleMultiBotSendNotifications(mockRequest, mockEnv, '18xx.games', 123456789);

    expect(response.status).toBe(422);
    expect(await response.text()).toBe('Message has invalid format');
  });

  it('should handle errors', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Test error')),
    } as any;

    const response = await handleMultiBotSendNotifications(mockRequest, mockEnv, '18xx.games', 123456789);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Test error');
  });
}); 