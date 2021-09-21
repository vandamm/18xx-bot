interface Incoming18xxMessage {
  text: string;
}

export class Parsed18xxMessage {
  private static pattern: RegExp =
    /<@(?<chatId>.*)> (?<message>.+ in \w+ ".*" \(.*\))\n(?<link>.*)/g;

  chatId: number;
  text: string;
  link: string;

  constructor(message: object) {
    const raw = <Incoming18xxMessage>message;

    if (!raw.text) return;

    const match = Parsed18xxMessage.pattern.exec(raw.text);

    if (!match) return;

    const { groups } = match;

    this.chatId = parseInt(groups.chatId);
    this.text = groups.text;
    this.link = groups.link;
  }
}
