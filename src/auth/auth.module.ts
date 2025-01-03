import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from './jwt.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [UserModule, CacheModule.register()],
  providers: [AuthService, JwtService, RolesGuard],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
