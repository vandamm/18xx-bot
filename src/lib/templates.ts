export function configurationMessage(chatId: number, baseUrl: string): string {
  if (!baseUrl) throw new Error('Base URL is undefined');

  const webhookUrl = `${baseUrl}/send-notifications/${chatId.toString()}`;

  return `Use these values on [18xx.games profile page](https://18xx.games/profile):

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: \`${webhookUrl}\`
*Webhook User ID*: Type anything here, maybe "Hi"`;
}

export function notificationMessage(text: string, link: string): string {
  return `${text}
[${link}](${link})`;
}
