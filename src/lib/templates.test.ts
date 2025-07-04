import { configurationMessage, notificationMessage } from './templates';

const env = process.env;

afterEach(() => (process.env = env));

test('configurationMessage requires webhook url', () => {
  expect(() => configurationMessage(1, '')).toThrow(
    'Base URL is undefined'
  );
});

test('configurationMessage matches template', () => {
  expect(configurationMessage(1, 'https://test.com')).toMatchInlineSnapshot(`
      "Use these values on [18xx.games profile page](https://18xx.games/profile):

      *Turn/Message Notifications*: Webhook
      *Webhook*: Custom
      *Webhook URL*: \`https://test.com/send-notifications/1\`
      *Webhook User ID*: Type anything here, maybe \\"Hi\\""
    `);
});

test('notificationMessage matches template', () => {
  expect(notificationMessage('text', 'https://link')).toMatchInlineSnapshot(`
      "text
      [https://link](https://link)"
    `);
});
