import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import { AuthResponse } from './dto/authResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  login(
    @Body() userDto: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return this.authService.signin(userDto, response);
  }

  @Post('/signup')
  async signUp(
    @Body() userDto: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return await this.authService.signUp(userDto, response);
  }
  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(request, response);
  }
}
