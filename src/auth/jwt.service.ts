import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { JwtUserPayload } from './types/jwt-payload.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn = '24h';
  private readonly expiresInNumber = 24 * 60 * 60 * 1000;
  private readonly blacklistPrefix = 'jwt:blacklist';

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.secret = this.configService.get<string>(
      'JWT_SECRET',
      'default-secret',
    );
  }

  generateToken(payload: JwtUserPayload): string {
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): JwtUserPayload {
    try {
      return verify(token, this.secret) as JwtUserPayload;
    } catch {
      throw new Error('Invalid token');
    }
  }

  async addTokenToBlacklist(token: string): Promise<void> {
    const key = `${this.blacklistPrefix}:${token}`;
    await this.cacheManager.set(key, true, this.expiresInNumber);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `${this.blacklistPrefix}:${token}`;
    const result = await this.cacheManager.get<boolean>(key);
    return !!result;
  }
}
