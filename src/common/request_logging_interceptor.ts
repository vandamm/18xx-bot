import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { originalUrl, method, params, query, body } = context
      .switchToHttp()
      .getRequest();

    this.logger.log({
      originalUrl,
      method,
      params,
      query,
      body,
    });

    return next.handle();
  }
}
