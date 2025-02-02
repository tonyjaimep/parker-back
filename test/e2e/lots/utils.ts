import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CreateLotRequestDto } from 'src/lots/dto/create-lot.dto';
import { Credentials } from '../utils';

export const createLot = (
  app: INestApplication,
  credentials: Credentials,
  dto: CreateLotRequestDto,
) => {
  return request(app.getHttpServer())
    .post('/lots')
    .send(dto)
    .auth(credentials.token, { type: 'bearer' })
    .expect(201);
};
