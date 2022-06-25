import { Module } from '@nestjs/common';
import { UserModule } from 'user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';
import { ActivationModule } from './activation/activation.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, TokenModule, ActivationModule],
  exports: [AuthService],
})
export class AuthModule {}
