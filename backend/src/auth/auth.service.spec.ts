import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { adminUser: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      adminUser: {
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token'), verify: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const map: Record<string, unknown> = {
                'jwt.accessSecret': 's',
                'jwt.refreshSecret': 's',
                'jwt.accessExpiration': '15m',
                'jwt.refreshExpiration': '7d',
                'security.maxLoginAttempts': 5,
                'security.lockMinutes': 15,
              };
              return map[key];
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('rechaza credenciales inválidas cuando el usuario no existe', async () => {
    prisma.adminUser.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'x@y.com', password: 'password123' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('permite login con credenciales correctas', async () => {
    const passwordHash = await argon2.hash('password123');
    prisma.adminUser.findUnique.mockResolvedValue({
      id: '1',
      email: 'x@y.com',
      firstName: 'A',
      lastName: 'B',
      role: 'ADMIN',
      isActive: true,
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });
    const result = await service.login({ email: 'x@y.com', password: 'password123' });
    expect(result.tokens.accessToken).toBe('token');
    expect(result.user.email).toBe('x@y.com');
  });
});
