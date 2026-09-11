import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisitorDto {
  @ApiProperty({
    example: 'Rohan Gupta',
    description: 'Full name of the visitor',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    example: 'rohan.gupta@tcs.com',
    description: 'Visitor email address',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: '+91-9890123456',
    description: 'Visitor phone number (10 digit mobile)',
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiPropertyOptional({
    example: 'Tata Consultancy Services',
    description: 'Organization or company name',
  })
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  company?: string;

  @ApiProperty({
    example: 'Sprint Planning & Architecture Discussion',
    description: 'Reason / purpose for visiting',
  })
  @IsString({ message: 'Purpose must be a string' })
  @IsNotEmpty({ message: 'Purpose is required' })
  purpose: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'User ID of the employee host',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Host User ID must be an integer' })
  hostUserId?: number;

  @ApiPropertyOptional({
    example: 'Amit Patel',
    description: 'Name of the host employee if not registered in system',
  })
  @IsOptional()
  @IsString({ message: 'Host name must be a string' })
  hostName?: string;

  @ApiPropertyOptional({
    example: 'V-101',
    description: 'Assigned visitor pass / badge number',
  })
  @IsOptional()
  @IsString({ message: 'Badge number must be a string' })
  badgeNumber?: string;

  @ApiPropertyOptional({
    example: '2026-09-11T10:00:00.000Z',
    description: 'Check-in timestamp',
  })
  @IsOptional()
  @IsDateString({}, { message: 'checkInTime must be a valid ISO 8601 date string' })
  checkInTime?: string;

  @ApiPropertyOptional({
    example: 'Needs guest Wi-Fi credentials for laptop',
    description: 'Additional notes or requirements',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
