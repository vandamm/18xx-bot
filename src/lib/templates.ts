export const DEFAULT_CONFIGURATION_MESSAGE = `🔔 **Webhook Notifications Setup**

To receive notifications in this chat:

1\\. Copy this webhook URL: \`{{WEBHOOK_URL}}\`
2\\. Configure your notification source to send webhooks to this URL
3\\. Set any required User ID field to any value \\(e\\.g\\., "notifications"\\)

✅ You're all set\\! Notifications will be delivered to this chat\\.`;

function escapeMarkdownV2(text: string): string {
  // Characters that need escaping in MarkdownV2: _ * [ ] ( ) ~ ` > # + - = | { } . !
  return text.replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, '\\$1');
}

function processMarkdownV2Formatting(text: string): string {
  // Temporarily replace existing double asterisks with placeholders
  const doublePlaceholder = '___DOUBLE_ASTERISK___';
  text = text.replace(/\*\*([^*]+)\*\*/g, `${doublePlaceholder}$1${doublePlaceholder}`);
  
  // Now convert remaining single asterisks to double asterisks
  text = text.replace(/\*([^*\n]+)\*/g, '**$1**');
  
  // Restore the original double asterisks
  text = text.replace(new RegExp(`${doublePlaceholder}([^_]+)${doublePlaceholder}`, 'g'), '**$1**');
  
  // Escape dots (periods) for MarkdownV2
  text = text.replace(/\./g, '\\.');
  
  // Escape parentheses
  text = text.replace(/([()])/g, '\\$1');
  
  // Escape other problematic characters
  text = text.replace(/([#+\-=|{}!])/g, '\\$1');
  
  return text;
}

export function processConfigurationMessage(template: string, chatId: number, baseUrl: string): string {
  if (!baseUrl) throw new Error('Base URL is undefined');
  if (!template) throw new Error('Configuration message template is undefined');

  const webhookUrl = `${baseUrl}/send-notifications/${chatId.toString()}`;
  const webhookBaseUrl = `${baseUrl}/send-notifications`;
  const userId = chatId.toString();
  
  // First replace placeholders with unescaped values
  const messageWithReplacements = template
    .replace(/\{\{WEBHOOK_URL\}\}/g, webhookUrl)
    .replace(/\{\{WEBHOOK_BASE_URL\}\}/g, webhookBaseUrl)
    .replace(/\{\{USER_ID\}\}/g, userId);
  
  // Then apply smart MarkdownV2 formatting and escaping
  return processMarkdownV2Formatting(messageWithReplacements);
}

export function notificationMessage(text: string, link: string): string {
  const escapedText = escapeMarkdownV2(text);
  const escapedLink = escapeMarkdownV2(link);
  
  return `${escapedText}
[${escapedLink}](${escapedLink})`;
}
