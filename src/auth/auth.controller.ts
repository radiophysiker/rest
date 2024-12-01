import { Body, Controller, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.authService.register(createUserDto);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('signin')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.sign(loginUserDto);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }
}
