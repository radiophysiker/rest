import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { RoleEnum } from 'src/common/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }
    const { password, ...rest } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      ...rest,
      role: RoleEnum.USER,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findOne(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: query,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findMany(
    query?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[]> {
    return this.userRepository.find({
      where: query,
    });
  }

  async removeOne(
    query: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return user;
  }

  async updateOne(
    query: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: query });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email, username, password } = updateUserDto;
    if (email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
        select: ['id'],
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (username) {
      const existingUser = await this.userRepository.findOne({
        where: { username },
        select: ['id'],
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictException('User with this username already exists');
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  findById(id: number): Promise<User> {
    return this.findOne({ id });
  }

  findByUsername(username: string): Promise<User> {
    return this.findOne({ username });
  }

  removeById(id: number): Promise<User> {
    return this.removeOne({ id });
  }

  updateById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.updateOne({ id }, updateUserDto);
  }
}
