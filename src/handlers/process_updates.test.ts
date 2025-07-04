import { handleProcessUpdates } from './process_updates';
import { getBotInstance } from '../lib/bot_repository';
import { Update } from 'typegram';

jest.mock('../lib/bot_repository', () => ({
  getBotInstance: jest.fn(),
}));

describe('handleProcessUpdates', () => {
  let mockBot: any;
  let mockEnv: any;

  beforeEach(() => {
    mockBot = {
      processUpdate: jest.fn(),
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

  it('should handle telegram updates successfully', async () => {
    const update = {
      update_id: 123,
      message: {
        message_id: 1,
        date: 1234567890,
        chat: { id: 123, type: 'private' },
        text: '/start',
      },
    };

    const request = new Request('https://test.com/process-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });

    const response = await handleProcessUpdates(request, mockEnv);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
    expect(getBotInstance).toHaveBeenCalledWith(mockEnv);
    expect(mockBot.processUpdate).toHaveBeenCalledWith(update, mockEnv.WEBHOOK_URL_18XX);
  });

  it('should handle errors in process updates', async () => {
    mockBot.processUpdate.mockRejectedValue(new Error('Bot error'));

    const request = new Request('https://test.com/process-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ update_id: 123 }),
    });

    const response = await handleProcessUpdates(request, mockEnv);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Bot error');
  });
}); 