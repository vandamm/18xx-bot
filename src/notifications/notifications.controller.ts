import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Parsed18xxMessage } from '../common/18xx_message';
import { notificationMessage } from '../common/templates';
import { Parse18xxMessagePipe } from '../common/parse_18xx_message.pipe';
import { BotService } from '../bot.service';
import { RequestLoggingInterceptor } from '../common/request_logging_interceptor';

@Controller('send-notifications')
@UseInterceptors(RequestLoggingInterceptor)
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
