import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findMany();
      return users.map((user) => plainToClass(User, user));
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findById(id);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.updateById(id, updateUserDto);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.removeById(id);
      return plainToClass(User, user);
    } catch (error) {
      throw error;
    }
  }
}
