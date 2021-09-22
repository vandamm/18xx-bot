import { Parsed18xxMessage } from './18xx_message';

const event =
  '{"text":"<@123456789> Your Turn in 1836Jr30 \\"Test game\\" (Auction Round 1)\\nhttp://18xx.games/game/1234"}';

const emptyMessage = {
  userId: undefined,
  text: undefined,
  title: undefined,
  description: undefined,
  round: undefined,
  turn: undefined,
  link: undefined,
};

test('does nothing if text is empty', () => {
  const message = new Parsed18xxMessage({ text: '' });

  expect(message).toEqual(emptyMessage);
});

test('does nothing if text does not match', () => {
  const message = new Parsed18xxMessage({ text: 'asdasdasd' });

  expect(message).toEqual(emptyMessage);
});

test('does nothing if input is empty', () => {
  const message = new Parsed18xxMessage(JSON.parse('""'));

  expect(message).toEqual(emptyMessage);
});

test('parses message', () => {
  const message = new Parsed18xxMessage(JSON.parse(event));

  expect(message).toEqual({
    userId: '123456789',
    text: 'Your Turn',
    title: '1836Jr30',
    description: 'Test game',
    round: 'Auction Round',
    turn: 1,
    link: 'http://18xx.games/game/1234',
  });
});
