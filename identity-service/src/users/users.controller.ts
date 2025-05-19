import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserRequestDto } from './dto/register-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserSelect } from './types';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseAuth()
  @Get('me')
  async getUser(@User() user: UserSelect) {
    const selectedUser = await this.usersService.getUserById(user.id);
    if (!selectedUser) {
      throw new UnauthorizedException();
    }
    return selectedUser;
  }

  @Post('me')
  async registerUser(
    @Req() req: Request,
    @Body() body: RegisterUserRequestDto,
  ) {
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split('Bearer ')[1];
      return await this.usersService.registerWithFirebaseToken(
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
    @User() user: UserSelect,
    @Body() body: UpdateUserRequestDto,
  ) {
    return this.usersService.updateUser(user.id, body);
  }

  @UseAuth()
  @Get('is-verified')
  async getIsUserVerified(@User() user: UserSelect) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const isVerified = await this.usersService.isUserVerified(user);

    return { isVerified };
  }
}
