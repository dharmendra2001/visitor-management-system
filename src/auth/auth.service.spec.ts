import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mocked.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials and return JWT token', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'rahul.sharma@vms.com',
        password: hashedPassword,
        name: 'Rahul Sharma',
        role: 'ADMIN',
        department: 'IT',
      });

      const result = await service.login({
        email: 'rahul.sharma@vms.com',
        password: 'Password123',
      });

      expect(result.data.accessToken).toBe('mocked.jwt.token');
      expect(result.data.user.email).toBe('rahul.sharma@vms.com');
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if email not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@vms.com', password: 'Password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPass', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'rahul.sharma@vms.com',
        password: hashedPassword,
      });

      await expect(
        service.login({ email: 'rahul.sharma@vms.com', password: 'WrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 2,
        name: 'Pooja Verma',
        email: 'pooja.verma@vms.com',
        role: 'RECEPTIONIST',
        department: 'Front Desk',
        phone: '+91-9812345678',
        createdAt: new Date(),
      });

      const result = await service.register({
        name: 'Pooja Verma',
        email: 'pooja.verma@vms.com',
        password: 'SecurePassword123',
      });

      expect(result.data.id).toBe(2);
      expect(result.data.email).toBe('pooja.verma@vms.com');
    });

    it('should throw ConflictException if email is already registered', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@vms.com',
      });

      await expect(
        service.register({
          name: 'Existing User',
          email: 'existing@vms.com',
          password: 'Password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
