import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
      };
      return config[key] ?? defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      displayName: 'Test User',
    };

    it('should create a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-id',
        username: signupDto.username,
        email: signupDto.email,
        displayName: signupDto.displayName,
        passwordHash: 'hashedPassword',
      });

      const result = await service.signup(signupDto);

      expect(result.user).toEqual({
        id: 'user-id',
        username: signupDto.username,
        email: signupDto.email,
        displayName: signupDto.displayName,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 12);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: 'existing-user',
        email: signupDto.email,
      });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if username already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 'existing-user',
        username: signupDto.username,
      });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const mockUser = {
      id: 'user-id',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      passwordHash: 'hashedPassword',
    };

    it('should login successfully with valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('user-id');

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token', () => {
      const user = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
      };
      mockJwtService.sign.mockReturnValue('access-token');

      const result = service.generateAccessToken(user);

      expect(result).toBe('access-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, username: user.username },
        { secret: 'test-secret', expiresIn: 15 * 60 },
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token', () => {
      const user = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
      };
      mockJwtService.sign.mockReturnValue('refresh-token');

      const result = service.generateRefreshToken(user);

      expect(result).toBe('refresh-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, username: user.username },
        { secret: 'test-secret', expiresIn: 7 * 24 * 60 * 60 },
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const payload = { sub: 'user-id', username: 'testuser' };
      mockJwtService.verify.mockReturnValue(payload);

      const result = service.verifyRefreshToken('valid-token');

      expect(result).toEqual(payload);
    });

    it('should throw UnauthorizedException for invalid token', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyRefreshToken('invalid-token')).toThrow(UnauthorizedException);
    });
  });
});
