import { handleSendNotifications } from './send_notifications';
import { getBotInstance } from '../lib/bot_repository';

jest.mock('../lib/bot_repository', () => ({
  getBotInstance: jest.fn(),
}));

describe('handleSendNotifications', () => {
  let mockBot: any;
  let mockEnv: any;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn(),
    };
    (getBotInstance as jest.Mock).mockResolvedValue(mockBot);
    
    mockEnv = {
      TELEGRAM_BOT_18XX: 'test-bot-token',
      WEBHOOK_URL_18XX: 'https://test.com/send-notifications/',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send notifications successfully', async () => {
    const messageBody = {
      text: '<@User> Your Turn in 1836Jr30 "Test game" (Auction Round 1)\nhttp://18xx.games/game/1234',
    };

    const request = new Request('https://test.com/send-notifications/123456789', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageBody),
    });

    const response = await handleSendNotifications(request, mockEnv, 123456789);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
    expect(getBotInstance).toHaveBeenCalledWith(mockEnv);
    expect(mockBot.sendMessage).toHaveBeenCalledWith(
      123456789,
      'Your Turn in 1836Jr30 "Test game" (Auction Round 1)\n[http://18xx.games/game/1234](http://18xx.games/game/1234)'
    );
  });

  it('should return 400 for invalid chatId', async () => {
    const request = new Request('https://test.com/send-notifications/invalid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'test' }),
    });

    const response = await handleSendNotifications(request, mockEnv, NaN);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid input');
    expect(mockBot.sendMessage).not.toHaveBeenCalled();
  });

  it('should return 422 for invalid message format', async () => {
    const request = new Request('https://test.com/send-notifications/123456789', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'invalid format' }),
    });

    const response = await handleSendNotifications(request, mockEnv, 123456789);

    expect(response.status).toBe(422);
    expect(await response.text()).toBe('Message has invalid format');
    expect(mockBot.sendMessage).not.toHaveBeenCalled();
  });

  it('should handle errors in send notifications', async () => {
    mockBot.sendMessage.mockRejectedValue(new Error('Send error'));

    const messageBody = {
      text: '<@User> Your Turn in 1836Jr30 "Test game" (Auction Round 1)\nhttp://18xx.games/game/1234',
    };

    const request = new Request('https://test.com/send-notifications/123456789', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageBody),
    });

    const response = await handleSendNotifications(request, mockEnv, 123456789);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Send error');
  });
}); 