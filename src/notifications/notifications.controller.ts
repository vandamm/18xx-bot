import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Parsed18xxMessage } from '../common/18xx_message';
import { notificationMessage } from '../common/templates';
import { Parse18xxMessagePipe } from '../common/parse_18xx_message.pipe';
import { BotService } from '../bot.service';

@Controller('send-notifications')
export class NotificationsController {
  constructor(private readonly botService: BotService) {}

  @Post(':chatId')
  async sendNotification(
    @Param('chatId', new ParseIntPipe())
    chatId: number,
    @Body(new Parse18xxMessagePipe())
    message: Parsed18xxMessage,
  ) {
    await this.botService.sendMessage(
      chatId,
      notificationMessage(message.toString(), message.link),
    );
  }
}
