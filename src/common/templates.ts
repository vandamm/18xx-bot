export function configurationMessage(chatId: number): string {
  const { HOST_URL } = process.env;

  if (!HOST_URL) throw new Error('HOST_URL is undefined');

  return `Use these values on [18xx.games profile page](https://18xx.games/profile):

*Turn/Message Notifications*: Webhook
*Webhook*: Custom
*Webhook URL*: \`${HOST_URL}/send-notifications/${chatId.toString()}\`
*Webhook User ID*: Type anything here, maybe "Hi"`;
}

export function notificationMessage(text: string, link: string): string {
  return `${text}
[${link}](${link})`;
}
