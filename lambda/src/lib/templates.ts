export function configurationMessage(chatId: number): string {
  const { WEBHOOK_URL_18XX } = process.env;

  if (!WEBHOOK_URL_18XX) throw new Error('WEBHOOK_URL_18XX is undefined');

  return `Use these values on [18xx.games profile page](https://18xx.games/profile):

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: \`${WEBHOOK_URL_18XX}${chatId.toString()}\`
*Webhook User ID*: Type anything here, maybe "Hi"`;
}

export function notificationMessage(text: string, link: string): string {
  return `${text}
[${link}](${link})`;
}
