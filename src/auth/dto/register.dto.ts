import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'Aakash Verma',
    description: 'Full name of the user',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 'aakash.verma@vms.com',
    description: 'Unique email address',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'Secret@123',
    description: 'Account password',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.RECEPTIONIST,
    description: 'System role assigned to user',
    default: Role.RECEPTIONIST,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN, RECEPTIONIST, or HOST' })
  role?: Role;

  @ApiPropertyOptional({
    example: 'Engineering',
    description: 'Department name',
  })
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  department?: string;

  @ApiPropertyOptional({
    example: '+91-9876543210',
    description: 'Contact phone number',
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;
}
