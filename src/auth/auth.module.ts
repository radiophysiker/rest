import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from './jwt.service';

@Module({
  imports: [UserModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
