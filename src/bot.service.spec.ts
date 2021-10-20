import { Test, TestingModule } from '@nestjs/testing';
import { TelegramClient } from 'messaging-api-telegram';
import { Update } from 'typegram';
import { BotService } from './bot.service';

jest.mock('./common/templates', () => {
  return {
    __esModule: true,
    configurationMessage: (chatId: number) => chatId.toString(),
  };
});

describe('BotService', () => {
  let botService: BotService;
  let mockFn: jest.Mock;

  beforeEach(async () => {
    mockFn = mockTelegramClientRequest();

    const module: TestingModule = await Test.createTestingModule({
      providers: [BotService],
    }).compile();

    botService = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    expect(botService).toBeDefined();
  });

  it('fails sending without token', async () => {
    try {
      await botService.sendMessage(0, '');
    } catch (e) {
      expect(e.message).toEqual('Access token undefined');
    }
  });

  it('sends message', async () => {
    process.env.TELEGRAM_BOT_SECRET = '123';

    await botService.sendMessage(456, 'test');

    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0]).toEqual([
      '/sendMessage',
      {
        chatId: 456,
        text: 'test',
        parseMode: 'Markdown',
      },
    ]);
  });

  it('processes updates', async () => {
    await botService.processUpdate(<Update.MessageUpdate>{
      message: { chat: { id: 456 }, text: '/start' },
    });

    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0]).toEqual([
      '/sendMessage',
      {
        chatId: 456,
        text: '456',
        parseMode: 'Markdown',
      },
    ]);
  });

  it('does not process non-start updates', async () => {
    await botService.processUpdate(<Update.MessageUpdate>{
      message: { chat: { id: 456 }, text: 'hello' },
    });

    expect(mockFn.mock.calls.length).toBe(0);
  });

  it('does not process non-message updates', async () => {
    await botService.processUpdate(<Update>{});

    expect(mockFn.mock.calls.length).toBe(0);
  });

  it('does not process empty updates', async () => {
    await botService.processUpdate(null);

    expect(mockFn.mock.calls.length).toBe(0);
  });
});

function mockTelegramClientRequest(implementation?: any) {
  const mockFn = jest.fn(implementation);

  jest
    .spyOn(TelegramClient.prototype as any, 'request')
    .mockImplementation(mockFn);

  return mockFn;
}
