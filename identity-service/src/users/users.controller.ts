import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterUserRequestDto } from './dto/register-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('get_user_from_token')
  async getUserFromToken({ token }: { token: string }) {
    return this.usersService.getUserFromFirebaseToken(token);
  }

  @MessagePattern('register_user_with_firebase_token')
  async registerUser({
    user,
    token,
  }: {
    user: RegisterUserRequestDto;
    token: string;
  }) {
    return this.usersService.registerWithFirebaseToken(
      {
        ...user,
        displayName: user.displayName || user.fullName.split(' ')[0],
      },
      token,
    );
  }

  @MessagePattern('update_user')
  async updateUser({ id, data }: { id: number; data: UpdateUserRequestDto }) {
    return this.usersService.updateUser(id, data);
  }

  @MessagePattern('get_is_user_verified')
  async getIsUserVerified({ id }: { id: number }) {
    const isVerified = await this.usersService.isUserVerified(id);

    return { isVerified };
  }
}
