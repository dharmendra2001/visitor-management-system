import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VisitorStatus } from '@prisma/client';

export class UpdateVisitorDto {
  @ApiPropertyOptional({
    example: 'Rohan Gupta',
    description: 'Full name of the visitor',
  })
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  fullName?: string;

  @ApiPropertyOptional({
    example: 'rohan.gupta@tcs.com',
    description: 'Visitor email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address format' })
  email?: string;

  @ApiPropertyOptional({
    example: '+91-9890123456',
    description: 'Visitor phone number',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Tata Consultancy Services Ltd',
    description: 'Company/Organization',
  })
  @IsOptional()
  @IsString({ message: 'Company must be a string' })
  company?: string;

  @ApiPropertyOptional({
    example: 'Sprint Review & Demo',
    description: 'Purpose of visit',
  })
  @IsOptional()
  @IsString({ message: 'Purpose must be a string' })
  purpose?: string;

  @ApiPropertyOptional({
    enum: VisitorStatus,
    example: VisitorStatus.PENDING,
    description: 'Status of the visitor',
  })
  @IsOptional()
  @IsEnum(VisitorStatus, {
    message: 'Status must be PENDING, APPROVED, or REJECTED',
  })
  status?: VisitorStatus;

  @ApiPropertyOptional({
    example: 3,
    description: 'Internal User ID of the host employee',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Host User ID must be an integer' })
  hostUserId?: number;

  @ApiPropertyOptional({
    example: 'Amit Patel',
    description: 'Name of the host employee',
  })
  @IsOptional()
  @IsString({ message: 'Host name must be a string' })
  hostName?: string;

  @ApiPropertyOptional({
    example: 'V-101',
    description: 'Visitor badge/pass number',
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
    example: '2026-09-11T12:30:00.000Z',
    description: 'Check-out timestamp',
  })
  @IsOptional()
  @IsDateString({}, { message: 'checkOutTime must be a valid ISO 8601 date string' })
  checkOutTime?: string;

  @ApiPropertyOptional({
    example: 'Shifted to 3rd Floor Boardroom',
    description: 'Notes on the visit',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiPropertyOptional({
    example: 'Security verification pending',
    description: 'Reason if rejected',
  })
  @IsOptional()
  @IsString({ message: 'Rejection reason must be a string' })
  rejectionReason?: string;
}
