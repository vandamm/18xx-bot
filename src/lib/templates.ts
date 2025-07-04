export function configurationMessage(chatId: number, webhookUrl: string): string {
  if (!webhookUrl) throw new Error('WEBHOOK_URL_18XX is undefined');

  return `Use these values on [18xx.games profile page](https://18xx.games/profile):

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: \`${webhookUrl}${chatId.toString()}\`
*Webhook User ID*: Type anything here, maybe "Hi"`;
}

export function notificationMessage(text: string, link: string): string {
  return `${text}
[${link}](${link})`;
}
