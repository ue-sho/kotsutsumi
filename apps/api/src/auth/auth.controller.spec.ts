import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService, UserResponse } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      return undefined;
    }),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  const mockRequest = {
    cookies: {
      refresh_token: 'valid-refresh-token',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      displayName: 'Test User',
    };

    const mockUser: UserResponse = {
      id: 'user-id',
      username: signupDto.username,
      email: signupDto.email,
      displayName: signupDto.displayName,
    };

    it('should signup user and set cookies', async () => {
      mockAuthService.signup.mockResolvedValue({ user: mockUser });
      mockAuthService.generateAccessToken.mockReturnValue('access-token');
      mockAuthService.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await controller.signup(signupDto, mockResponse as any);

      expect(result).toEqual({ user: mockUser });
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'access-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const mockUser: UserResponse = {
      id: 'user-id',
      username: 'testuser',
      email: loginDto.email,
      displayName: 'Test User',
    };

    it('should login user and set cookies', async () => {
      mockAuthService.login.mockResolvedValue({ user: mockUser });
      mockAuthService.generateAccessToken.mockReturnValue('access-token');
      mockAuthService.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await controller.login(loginDto, mockResponse as any);

      expect(result).toEqual({ user: mockUser });
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('logout', () => {
    it('should clear cookies on logout', () => {
      const result = controller.logout(mockResponse as any);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token', {
        path: '/',
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refresh_token', {
        path: '/',
      });
    });
  });

  describe('refresh', () => {
    const mockUser: UserResponse = {
      id: 'user-id',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    it('should refresh tokens successfully', async () => {
      mockAuthService.verifyRefreshToken.mockReturnValue({
        sub: 'user-id',
        username: 'testuser',
      });
      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.generateAccessToken.mockReturnValue('new-access-token');
      mockAuthService.generateRefreshToken.mockReturnValue('new-refresh-token');

      const result = await controller.refresh(mockRequest as any, mockResponse as any);

      expect(result).toEqual({ message: 'Token refreshed successfully' });
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException if no refresh token', async () => {
      const requestWithoutToken = { cookies: {} };

      await expect(
        controller.refresh(requestWithoutToken as any, mockResponse as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthService.verifyRefreshToken.mockReturnValue({
        sub: 'user-id',
        username: 'testuser',
      });
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.refresh(mockRequest as any, mockResponse as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getMe', () => {
    it('should return current user', () => {
      const mockUser: UserResponse = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      const result = controller.getMe(mockUser);

      expect(result).toEqual({ user: mockUser });
    });
  });
});
