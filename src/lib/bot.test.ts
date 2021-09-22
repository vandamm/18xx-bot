import { TelegramClient } from 'messaging-api-telegram';
import { Update } from 'typegram';
import { Bot } from './bot';

jest.mock('./templates', () => {
  return {
    __esModule: true,
    configurationMessage: (chatId: number) => chatId.toString(),
  };
});

test('fails initialization without token', () => {
  expect(() => new Bot('')).toThrowError('Access token undefined');
});

test('sends message', async () => {
  const mockFn = mockTelegramClientRequest();

  const bot = new Bot('token');

  await bot.sendMessage(456, 'test');

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

test('processes updates', async () => {
  const mockFn = mockTelegramClientRequest();

  const bot = new Bot('token');

  await bot.processUpdate(<Update.MessageUpdate>{
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

test('does not process non-start updates', async () => {
  const mockFn = mockTelegramClientRequest();

  const bot = new Bot('token');

  await bot.processUpdate(<Update.MessageUpdate>{
    message: { chat: { id: 456 }, text: 'hello' },
  });

  expect(mockFn.mock.calls.length).toBe(0);
});

test('does not process non-message updates', async () => {
  const mockFn = mockTelegramClientRequest();

  const bot = new Bot('token');

  await bot.processUpdate(<Update>{});

  expect(mockFn.mock.calls.length).toBe(0);
});

function mockTelegramClientRequest(implementation?: any) {
  const mockFn = jest.fn(implementation);

  jest
    .spyOn(TelegramClient.prototype as any, 'request')
    .mockImplementation(mockFn);

  return mockFn;
}
