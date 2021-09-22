import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  Context,
} from 'aws-lambda';
import { TelegramClient } from 'messaging-api-telegram';

const body =
  '{"text":"<@User> Your Turn in 1836Jr30 \\"Test game\\" (Auction Round 1)\\nhttp://18xx.games/game/1234"}';

const pathParameters = <APIGatewayProxyEventPathParameters>{
  chatId: '123456789',
};

const originalEnv = process.env;

afterAll(() => {
  process.env = originalEnv;
});

process.env.TELEGRAM_BOT_TOKEN = '123';

import { handler } from './send_notifications';

test('sends notifications successfully', async () => {
  const mockFn = mockTelegramClientRequest();

  const result = await handler(
    <APIGatewayProxyEvent>{
      body,
      pathParameters,
    },
    <Context>{},
    () => {}
  );

  expect(result).toEqual({ statusCode: 200, body: 'OK' });
  expect(mockFn.mock.calls.length).toBe(1);
  expect(mockFn.mock.calls[0]).toEqual([
    '/sendMessage',
    {
      chatId: 123456789,
      // FIXME: Mock message template?
      text: 'Your Turn in 1836Jr30 "Test game" (Auction Round 1)\n[http://18xx.games/game/1234](http://18xx.games/game/1234)',
      parseMode: 'Markdown',
    },
  ]);
});

test('fails if chatId is not specified', async () => {
  const mockFn = mockTelegramClientRequest();

  const result = await handler(
    <APIGatewayProxyEvent>{ body },
    <Context>{},
    () => {}
  );

  expect(result).toEqual({ statusCode: 400, body: 'Invalid input' });
  expect(mockFn.mock.calls.length).toBe(0);
});

test('does not send anything if text does not match', async () => {
  const mockFn = mockTelegramClientRequest();

  const result = await handler(
    <APIGatewayProxyEvent>{ body: '{"text":"sdfsdf"}', pathParameters },
    <Context>{},
    () => {}
  );

  expect(result).toEqual({
    statusCode: 422,
    body: 'Message has invalid format',
  });
  expect(mockFn.mock.calls.length).toBe(0);
});

test('fails if error happens', async () => {
  const error = 'Error happened';

  mockTelegramClientRequest(() => {
    throw new Error(error);
  });

  const result = await handler(
    <APIGatewayProxyEvent>{ body, pathParameters },
    <Context>{},
    () => {}
  );

  expect(result).toEqual({ statusCode: 500, body: error });
});

function mockTelegramClientRequest(implementation?: any) {
  const mockFn = jest.fn(implementation);

  jest
    .spyOn(TelegramClient.prototype as any, 'request')
    .mockImplementation(mockFn);

  return mockFn;
}
