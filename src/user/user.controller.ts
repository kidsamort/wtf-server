import { Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'auth/token/tokenAuth.guard';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  createUser(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
