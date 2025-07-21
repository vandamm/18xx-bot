import {
  DEFAULT_CONFIGURATION_MESSAGE,
  notificationMessage,
  processConfigurationMessage,
} from "./templates";

const env = process.env;

afterEach(() => (process.env = env));

test("configurationMessage requires webhook url", () => {
  expect(() =>
    processConfigurationMessage(DEFAULT_CONFIGURATION_MESSAGE, 1, "")
  ).toThrow("Base URL is undefined");
});

test("configurationMessage matches template", () => {
  expect(
    processConfigurationMessage(
      DEFAULT_CONFIGURATION_MESSAGE,
      1,
      "https://test.com"
    )
  ).toMatchInlineSnapshot(`
    "🔔 **Webhook Notifications Setup**

    To receive notifications in this chat:

    1\\\\\\\\. Copy this webhook URL: \`https://test\\\\.com/send\\\\-notifications/1\`
    2\\\\\\\\. Configure your notification source to send webhooks to this URL
    3\\\\\\\\. Set any required User ID field to any value \\\\\\\\(e\\\\\\\\.g\\\\\\\\., \\"notifications\\"\\\\\\\\)

    ✅ You're all set\\\\\\\\! Notifications will be delivered to this chat\\\\\\\\."
  `);
});

test("notificationMessage matches template", () => {
  expect(notificationMessage("text", "https://link")).toMatchInlineSnapshot(`
    "text
    [https://link](https://link)"
  `);
});

describe("processConfigurationMessage", () => {
  test("requires base URL", () => {
    expect(() => processConfigurationMessage("template", 1, "")).toThrow(
      "Base URL is undefined"
    );
  });

  test("requires template", () => {
    expect(() =>
      processConfigurationMessage("", 1, "https://test.com")
    ).toThrow("Configuration message template is undefined");
  });

  test("replaces single placeholder", () => {
    const template = "Use this URL: {{WEBHOOK_URL}}";
    const result = processConfigurationMessage(
      template,
      123,
      "https://example.com"
    );
    expect(result).toBe(
      "Use this URL: https://example\\.com/send\\-notifications/123"
    );
  });

  test("replaces multiple placeholders", () => {
    const template = "URL: {{WEBHOOK_URL}} and again: {{WEBHOOK_URL}}";
    const result = processConfigurationMessage(
      template,
      456,
      "https://test.com"
    );
    expect(result).toBe(
      "URL: https://test\\.com/send\\-notifications/456 and again: https://test\\.com/send\\-notifications/456"
    );
  });

  test("replaces WEBHOOK_BASE_URL placeholder", () => {
    const template = "Base URL: {{WEBHOOK_BASE_URL}}";
    const result = processConfigurationMessage(
      template,
      123,
      "https://example.com"
    );
    expect(result).toBe("Base URL: https://example\\.com/send\\-notifications");
  });

  test("replaces USER_ID placeholder", () => {
    const template = "Your ID: {{USER_ID}}";
    const result = processConfigurationMessage(
      template,
      789,
      "https://example.com"
    );
    expect(result).toBe("Your ID: 789");
  });

  test("replaces all three placeholders together", () => {
    const template =
      "Full URL: {{WEBHOOK_URL}}, Base: {{WEBHOOK_BASE_URL}}, ID: {{USER_ID}}";
    const result = processConfigurationMessage(
      template,
      456,
      "https://test.com"
    );
    expect(result).toBe(
      "Full URL: https://test\\.com/send\\-notifications/456, Base: https://test\\.com/send\\-notifications, ID: 456"
    );
  });

  test("handles template with no placeholders", () => {
    const template = "This is a message without placeholders";
    const result = processConfigurationMessage(
      template,
      789,
      "https://test.com"
    );
    expect(result).toBe("This is a message without placeholders");
  });

  test("processes complex custom configuration message", () => {
    const template = `🎮 **Game Notifications Setup**

To receive notifications from 18xx.games:

1. Go to your [18xx.games profile page](https://18xx.games/profile)
2. Set these values:

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: \`{{WEBHOOK_URL}}\`
*Webhook User ID*: Type anything here, maybe "Hi"

🚀 You're all set! You'll receive notifications here when it's your turn.`;

    const result = processConfigurationMessage(
      template,
      123456789,
      "https://ping.vansach.me"
    );

    expect(result).toMatchInlineSnapshot(`
      "🎮 **Game Notifications Setup**

      To receive notifications from 18xx\\\\.games:

      1\\\\. Go to your [18xx\\\\.games profile page]\\\\(https://18xx\\\\.games/profile\\\\)
      2\\\\. Set these values:

      **Turn/Message Notifications**: Webhook
      **Webhook**: Custom
      **Webhook URL**: \`https://ping\\\\.vansach\\\\.me/send\\\\-notifications/123456789\`
      **Webhook User ID**: Type anything here, maybe \\"Hi\\"

      🚀 You're all set\\\\! You'll receive notifications here when it's your turn\\\\."
    `);
  });

  test("processes template with all placeholders for flexible setup", () => {
    const template = `📬 **Advanced Webhook Setup**

Choose your setup method:

**Method 1 - Direct URL:**
Use: \`{{WEBHOOK_URL}}\`

**Method 2 - Separate fields:**
Webhook Base: \`{{WEBHOOK_BASE_URL}}\`
User ID: \`{{USER_ID}}\`

Both methods work the same way!`;

    const result = processConfigurationMessage(
      template,
      555,
      "https://api.example.com"
    );

    expect(result).toMatchInlineSnapshot(`
      "📬 **Advanced Webhook Setup**

      Choose your setup method:

      **Method 1 \\\\- Direct URL:**
      Use: \`https://api\\\\.example\\\\.com/send\\\\-notifications/555\`

      **Method 2 \\\\- Separate fields:**
      Webhook Base: \`https://api\\\\.example\\\\.com/send\\\\-notifications\`
      User ID: \`555\`

      Both methods work the same way\\\\!"
    `);
  });
});
