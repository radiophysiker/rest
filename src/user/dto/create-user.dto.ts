import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsString({ message: 'Username must be a string.' })
  @Length(2, 30, {
    message: 'Username must be between 2 and 30 characters.',
  })
  username: string;

  @IsNotEmpty({ message: 'Email should not be empty.' })
  @IsEmail({}, { message: 'Invalid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty.' })
  @IsString({ message: 'Password must be a string.' })
  @Length(6, 30, { message: 'Password must be between 6 and 30 characters.' })
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one number, one lowercase and one uppercase letter.',
  })
  password: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a URL address.' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'About must be a string.' })
  @Length(2, 200, { message: 'About must be between 2 and 200 characters.' })
  about?: string;
}
