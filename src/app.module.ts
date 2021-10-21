import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications/notifications.controller';
import { TelegramController } from './telegram/telegram.controller';
import { BotService } from './bot.service';

@Module({
  imports: [],
  controllers: [NotificationsController, TelegramController],
  providers: [BotService],
})
export class AppModule {}
