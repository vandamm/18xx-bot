import { configurationMessage, notificationMessage } from './templates';

const env = process.env;

afterEach(() => (process.env = env));

describe('configurationMessage', () => {
  it('requires webhook url', () => {
    expect(() => configurationMessage(1)).toThrow('HOST_URL is undefined');
  });

  it('matches template', () => {
    process.env.HOST_URL = 'https://test';

    expect(configurationMessage(1)).toMatchInlineSnapshot(`
        "Use these values on [18xx.games profile page](https://18xx.games/profile):

        *Turn/Message Notifications*: Webhook
        *Webhook*: Custom
        *Webhook URL*: \`https://test/send-notifications/1\`
        *Webhook User ID*: Type anything here, maybe \\"Hi\\""
      `);
  });
});

describe('notificationMessage', () => {
  it('matches template', () => {
    expect(notificationMessage('text', 'https://link')).toMatchInlineSnapshot(`
      "text
      [https://link](https://link)"
    `);
  });
});
