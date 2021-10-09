import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from '../bot.service';
import { Update } from 'typegram';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly botService: BotService) {}

  @Post('process-update')
  async processUpdate(@Body() update: Update) {
    await this.botService.processUpdate(update);
  }
}
