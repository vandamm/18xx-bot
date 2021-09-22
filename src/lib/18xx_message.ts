interface Incoming18xxMessage {
  text: string;
}

const MESSAGE_PATTERN: RegExp =
  /<@(?<userId>.*)> (?<text>.+) in (?<title>\w+) "(?<description>.*)" \((?<round>.*) (?<turn>\d+)\)\n(?<link>.*)/;

/**
 * Extracts and stores meaningful data from 18xx.games turn notification
 */
export class Parsed18xxMessage {
  readonly userId: string;
  readonly text: string;
  readonly title: string;
  readonly description: string;
  readonly round: string;
  readonly turn: number;
  readonly link: string;

  /**
   * Create a parsed message from request payload
   */
  constructor(message: Incoming18xxMessage) {
    const match = MESSAGE_PATTERN.exec(message.text);

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

  /**
   * Format message back to what it was except user id
   */
  toString(): string {
    if (!this.userId) return '';

    return `${this.text} in ${this.title} "${this.description}" (${this.round} ${this.turn})`;
  }
}