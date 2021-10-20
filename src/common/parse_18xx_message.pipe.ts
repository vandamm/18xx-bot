import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Parsed18xxMessage } from './18xx_message';

@Injectable()
export class Parse18xxMessagePipe implements PipeTransform {
  transform(value: any) {
    const message = new Parsed18xxMessage(value);

    if (!message.valid) {
      throw new BadRequestException('Invalid message format');
    }

    return message;
  }
}
