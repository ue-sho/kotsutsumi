import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { SignupDto, LoginDto } from './dto/index.js';

export interface TokenPayload {
  sub: string;
  username: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<{ user: UserResponse }> {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'このメールアドレスは既に登録されています',
      });
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException({
        code: 'USERNAME_ALREADY_EXISTS',
        message: 'このユーザー名は既に使用されています',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      },
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }

  async login(dto: LoginDto): Promise<{ user: UserResponse }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'メールアドレスまたはパスワードが間違っています',
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'メールアドレスまたはパスワードが間違っています',
      });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }

  async validateUser(userId: string): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    };
  }

  generateAccessToken(user: UserResponse): string {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
    };
    return this.jwtService.sign(payload as object, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 15 * 60, // 15 minutes in seconds
    });
  }

  generateRefreshToken(user: UserResponse): string {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
    };
    return this.jwtService.sign(payload as object, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException({
        code: 'TOKEN_INVALID',
        message: 'リフレッシュトークンが無効です',
      });
    }
  }
}
