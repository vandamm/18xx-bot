import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from '../bot.service';

jest.mock('../common/templates', () => {
  return {
    __esModule: true,
    notificationMessage: (text, link) => `${text}/${link}`,
  };
});

jest.mock('../common/18xx_message', () => {
  return {
    __esModule: true,
    Parsed18xxMessage: class {
      toString() {
        return 'message';
      }
      get link() {
        return 'link';
      }
    },
  };
});

import { NotificationsController } from './notifications.controller';
import { Parsed18xxMessage } from '../common/18xx_message';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let sendMessageMock;

  beforeEach(async () => {
    sendMessageMock = jest.fn();

    const BotServiceProvider = {
      provide: BotService,
      useValue: {
        sendMessage: sendMessageMock,
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [BotServiceProvider],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call sendMessages', async () => {
    const chatId = 42;
    const message = new Parsed18xxMessage(null);

    await controller.sendNotification(chatId, message);

    expect(sendMessageMock.mock.calls.length).toBe(1);
    expect(sendMessageMock.mock.calls[0]).toEqual([chatId, 'message/link']);
  });
});
