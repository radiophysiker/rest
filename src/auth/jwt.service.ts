import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { JwtUserPayload } from './types/jwt-payload.types';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn = '24h';

  constructor(private readonly configService: ConfigService) {
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
}
