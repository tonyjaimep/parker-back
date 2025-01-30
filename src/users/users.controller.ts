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
import { UsersService } from './users.service';
import { RegisterUserRequestDto } from './dto/register-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseAuth()
  @Get('me')
  async getUser(@Req() req: Request) {
    const user = await this.usersService.getUserById(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Post('me')
  async registerUser(
    @Req() req: Request,
    @Body() body: RegisterUserRequestDto,
  ) {
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split('Bearer ')[1];
      return await this.usersService.registerWithFirebase(
        {
          ...body,
          displayName: body.displayName || body.fullName,
        },
        token,
      );
    }
    throw new UnauthorizedException('no se obtuvo un token');
  }

  @UseAuth()
  @Patch('me')
  async updateUser(@Req() req: Request, @Body() body: UpdateUserRequestDto) {
    return this.usersService.updateUser(req.user.id, body);
  }

  @UseAuth()
  @Get('is-verified')
  async getIsUserVerified(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const isVerified = await this.usersService.isUserVerified(req.user);

    return { isVerified };
  }
}
