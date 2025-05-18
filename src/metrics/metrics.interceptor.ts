import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, route } = request;
    const path = route?.path || request.url;

    const end =
      this.metricsService.httpRequestDurationMicroseconds.startTimer();

    return next.handle().pipe(
      tap(
        () => {
          const statusCode = response.statusCode;
          this.metricsService.httpRequestCounter.inc({
            method,
            route: path,
            status_code: statusCode,
          });
          end({ method, route: path, status_code: statusCode });
        },
        (error) => {
          const statusCode = error.status || error.response?.statusCode || 500;
          this.metricsService.httpRequestCounter.inc({
            method,
            route: path,
            status_code: statusCode,
          });
          end({ method, route: path, status_code: statusCode });
          throw error;
        },
      ),
    );
  }
}
