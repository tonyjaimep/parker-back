import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Gauge,
  register,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  public readonly httpRequestDurationMicroseconds: Histogram<string>;
  public readonly httpRequestCounter: Counter<string>;
  public readonly activeConnectionsGauge: Gauge<string>;

  constructor() {
    this.httpRequestDurationMicroseconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.activeConnectionsGauge = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });
  }

  onModuleInit() {
    collectDefaultMetrics({ register });
    console.log('Default metrics collected and registered.');
  }

  get metrics(): Promise<string> {
    return register.metrics();
  }

  incrementActiveConnections() {
    this.activeConnectionsGauge.inc();
  }

  decrementActiveConnections() {
    this.activeConnectionsGauge.dec();
  }
}
