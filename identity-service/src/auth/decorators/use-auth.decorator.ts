import { applyDecorators, UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../guards/bearer-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UseAuth() {
  return applyDecorators(ApiBearerAuth(), UseGuards(BearerAuthGuard));
}
