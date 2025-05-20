import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IdentityService } from './identity.service';
import { UseAuth } from './decorators/use-auth.decorator';
import { User } from './decorators/user.decorator';
import { UserPayload } from 'src/constants/types';
import { RegisterUserRequestDto } from './dto/register-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly identityService: IdentityService) {}

  @UseAuth()
  @Get('me')
  async getUser(@User() user: UserPayload) {
    return user;
  }

  @Post('me')
  async registerUser(
    @Req() req: Request,
    @Body() body: RegisterUserRequestDto,
  ) {
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split('Bearer ')[1];
      return await this.identityService.registerUserWithFirebaseToken(
        {
          ...body,
          displayName: body.displayName || body.fullName,
        },
        token,
      );
    }
    throw new UnauthorizedException('Bearer token is required');
  }

  @UseAuth()
  @Patch('me')
  async updateUser(
    @User() user: UserPayload,
    @Body() body: UpdateUserRequestDto,
  ) {
    return this.identityService.updateUser(user.id, body);
  }

  @UseAuth()
  @Get('is-verified')
  async getIsUserVerified(@User() user: UserPayload) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.identityService.getIsUserVerified(user.id);
  }
}
