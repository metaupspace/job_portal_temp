import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockAdminService: { findByEmail: jest.Mock };
  let mockJwtService: { sign: jest.Mock };

  beforeEach(async () => {
    mockAdminService = { findByEmail: jest.fn() };
    mockJwtService = { sign: jest.fn().mockReturnValue('mock.jwt.token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: AdminService, useValue: mockAdminService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.sign.mockReturnValue('mock.jwt.token');
  });

  it('returns access_token on valid credentials', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    mockAdminService.findByEmail.mockResolvedValue({
      _id: { toString: () => 'admin-id-1' },
      email: 'admin@test.com',
      passwordHash,
    });

    const result = await service.login({ email: 'admin@test.com', password: 'password123' });

    expect(result).toEqual({ access_token: 'mock.jwt.token' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 'admin-id-1',
      email: 'admin@test.com',
      role: 'admin',
    });
  });

  it('throws UnauthorizedException when admin not found', async () => {
    mockAdminService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'wrong@test.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException on wrong password', async () => {
    const passwordHash = await bcrypt.hash('correctpass', 10);
    mockAdminService.findByEmail.mockResolvedValue({
      _id: { toString: () => 'admin-id-1' },
      email: 'admin@test.com',
      passwordHash,
    });

    await expect(
      service.login({ email: 'admin@test.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when admin email casing differs', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    mockAdminService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'WRONG@test.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
