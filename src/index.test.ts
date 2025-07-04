import { Env } from './index';

// Mock the telegram client
jest.mock('messaging-api-telegram', () => {
  return {
    TelegramClient: jest.fn().mockImplementation(() => ({
      sendMessage: jest.fn(),
    })),
  };
});

// Mock the bot repository
jest.mock('./lib/bot_repository', () => ({
  getBotInstance: jest.fn(),
}));

// Mock the handlers
jest.mock('./handlers/process_updates', () => ({
  handleProcessUpdates: jest.fn(),
}));

jest.mock('./handlers/send_notifications', () => ({
  handleSendNotifications: jest.fn(),
}));

import { TelegramClient } from 'messaging-api-telegram';
import { getBotInstance } from './lib/bot_repository';
import { handleProcessUpdates } from './handlers/process_updates';
import { handleSendNotifications } from './handlers/send_notifications';

// Import the worker after mocking
const worker = require('./index').default;

describe('Cloudflare Workers Handler', () => {
  let mockBot: any;
  let mockEnv: Env;
  let mockExecutionContext: any;

  beforeEach(() => {
    mockBot = {
      processUpdate: jest.fn(),
      sendMessage: jest.fn(),
    };
    (getBotInstance as jest.Mock).mockResolvedValue(mockBot);
    
    mockEnv = {
      TELEGRAM_BOT_18XX: 'test-bot-token',
    };
    
    mockExecutionContext = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /process-updates', () => {
    it('should handle telegram updates successfully', async () => {
      const mockResponse = new Response('OK', { status: 200 });
      (handleProcessUpdates as jest.Mock).mockResolvedValue(mockResponse);

      const request = new Request('https://test.com/process-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update_id: 123 }),
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('OK');
      expect(handleProcessUpdates).toHaveBeenCalledWith(request, mockEnv);
    });

    it('should handle errors in process updates', async () => {
      const mockResponse = new Response('Bot error', { status: 500 });
      (handleProcessUpdates as jest.Mock).mockResolvedValue(mockResponse);

      const request = new Request('https://test.com/process-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ update_id: 123 }),
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe('Bot error');
    });
  });

  describe('POST /send-notifications/{chatId}', () => {
    it('should send notifications successfully', async () => {
      const mockResponse = new Response('OK', { status: 200 });
      (handleSendNotifications as jest.Mock).mockResolvedValue(mockResponse);

      const request = new Request('https://test.com/send-notifications/123456789', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test' }),
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('OK');
      expect(handleSendNotifications).toHaveBeenCalledWith(request, mockEnv, 123456789);
    });

    it('should return 400 for invalid chatId', async () => {
      const mockResponse = new Response('Invalid input', { status: 400 });
      (handleSendNotifications as jest.Mock).mockResolvedValue(mockResponse);

      const request = new Request('https://test.com/send-notifications/invalid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test' }),
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Invalid input');
      expect(handleSendNotifications).toHaveBeenCalledWith(request, mockEnv, NaN);
    });

    it('should return 422 for invalid message format', async () => {
      const mockResponse = new Response('Message has invalid format', { status: 422 });
      (handleSendNotifications as jest.Mock).mockResolvedValue(mockResponse);

      const request = new Request('https://test.com/send-notifications/123456789', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'invalid format' }),
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(422);
      expect(await response.text()).toBe('Message has invalid format');
      expect(handleSendNotifications).toHaveBeenCalledWith(request, mockEnv, 123456789);
    });

    it('should handle errors in send notifications', async () => {
      const mockResponse = new Response('Send error', { status: 500 });
      (handleSendNotifications as jest.Mock).mockResolvedValue(mockResponse);

      const request = new Request('https://test.com/send-notifications/123456789', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test' }),
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe('Send error');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const request = new Request('https://test.com/unknown-route', {
        method: 'GET',
      });

      const response = await worker.fetch(request, mockEnv, mockExecutionContext);

      expect(response.status).toBe(404);
      expect(await response.text()).toBe('Not Found');
    });
  });
}); 