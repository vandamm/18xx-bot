interface Incoming18xxMessage {
  text: string;
}

const MESSAGE_PATTERN: RegExp =
  /<@(?<userId>.*)> (?<text>.+) in (?<title>\w+) "(?<description>.*)" \((?<round>.*) (?<turn>\d+)\)\n(?<link>.*)/;

export class Parsed18xxMessage {
  readonly userId: string;
  readonly text: string;
  readonly title: string;
  readonly description: string;
  readonly round: string;
  readonly turn: number;
  readonly link: string;

  constructor(message: object) {
    const raw = <Incoming18xxMessage>message;
    const match = MESSAGE_PATTERN.exec(raw.text);

    if (!match) return;

    const { userId, text, title, description, round, turn, link } =
      match.groups;

    this.userId = userId;
    this.text = text;
    this.title = title;
    this.description = description;
    this.round = round;
    this.turn = parseInt(turn);
    this.link = link;
  }
}
