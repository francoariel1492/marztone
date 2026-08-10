import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<{ tokens: TokenPair; user: PublicUser }> {
    const user = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
    const genericError = new UnauthorizedException('Credenciales inválidas');

    if (!user || !user.isActive) {
      throw genericError;
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Cuenta bloqueada temporalmente. Intentá más tarde.');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.registerFailedAttempt(user.id, user.failedLoginAttempts);
      throw genericError;
    }

    // Reset failed attempts
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        refreshTokenHash: await argon2.hash(tokens.refreshToken),
      },
    });

    return { tokens, user: this.toPublic(user) };
  }

  async refresh(userId: string, refreshToken: string): Promise<TokenPair> {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException('Sesión inválida');
    }
    const matches = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!matches) {
      throw new UnauthorizedException('Sesión inválida');
    }
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { refreshTokenHash: await argon2.hash(tokens.refreshToken) },
    });
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.toPublic(user);
  }

  verifyRefreshToken(token: string): { sub: string; email: string; role: string } {
    try {
      return this.jwt.verify(token, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  private async issueTokens(sub: string, email: string, role: string): Promise<TokenPair> {
    const payload = { sub, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiration'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiration'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async registerFailedAttempt(userId: string, current: number): Promise<void> {
    const maxAttempts = this.config.get<number>('security.maxLoginAttempts') ?? 5;
    const lockMinutes = this.config.get<number>('security.lockMinutes') ?? 15;
    const attempts = current + 1;
    const shouldLock = attempts >= maxAttempts;
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: shouldLock ? 0 : attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + lockMinutes * 60_000) : undefined,
      },
    });
  }

  private toPublic(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }): PublicUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
