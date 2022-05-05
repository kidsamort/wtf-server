import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'user/user.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import { AuthResponse } from './dto/authResponse.dto';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './token/token.service';
import { User } from 'user/user.model';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signUp(
    userDto: AuthRequestDto,
    response: Response,
  ): Promise<AuthResponse> {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('Почта уже используется', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    const token = this.tokenService.createToken(user);
    const tokenDb = await this.tokenService.saveToken(user.id, token);
    response.cookie('refreshToken', token.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return {
      user: { email: userDto.email, name: userDto.name },
      accessToken: tokenDb.accessToken,
    };
  }

  async signin(
    userDto: AuthRequestDto,
    response: Response,
  ): Promise<AuthResponse> {
    const user = await this.validateUser(userDto);
    await this.tokenService.cleanExpiredToken(user.id);

    const token = this.tokenService.createToken(user);
    const tokenDB = await this.tokenService.saveToken(user.id, token);
    response.cookie('refreshToken', token.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return {
      user: { name: user.name, email: user.email },
      accessToken: tokenDB.accessToken,
    };
  }

  async logout(request: Request, response: Response): Promise<any> {
    try {
      const { refreshToken } = request.cookies;
      const token = await this.tokenService.removeToken(refreshToken);
      response.clearCookie('refreshToken');
      return { logout: token };
    } catch (e) {
      throw new UnauthorizedException({ message: e });
    }
  }

  private async validateUser(userDto: AuthRequestDto): Promise<User> {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный емайл или пароль',
    });
  }
}
