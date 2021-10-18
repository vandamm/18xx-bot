import { Test, TestingModule } from '@nestjs/testing';
import { TelegramController } from './telegram.controller';
import { BotService } from '../bot.service';
import { Update } from 'typegram';

describe('TelegramController', () => {
  let controller: TelegramController;
  let processUpdateMock;

  beforeEach(async () => {
    processUpdateMock = jest.fn();

    const BotServiceProvider = {
      provide: BotService,
      useValue: {
        processUpdate: processUpdateMock,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelegramController],
      providers: [BotServiceProvider],
    }).compile();

    controller = module.get<TelegramController>(TelegramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process updates using bot service', async () => {
    const update = <Update>{};

    await controller.processUpdate(update);

    expect(processUpdateMock.mock.calls.length).toBe(1);
    expect(processUpdateMock.mock.calls[0]).toEqual([update]);
  });
});
