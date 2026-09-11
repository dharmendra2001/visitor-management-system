import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisitorStatus } from '@prisma/client';

export class ApproveVisitorDto {
  @ApiProperty({
    enum: VisitorStatus,
    example: VisitorStatus.APPROVED,
    description: 'Updated visitor approval status (APPROVED, REJECTED, or PENDING)',
  })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(VisitorStatus, {
    message: 'Status must be either APPROVED, REJECTED, or PENDING',
  })
  status: VisitorStatus;

  @ApiPropertyOptional({
    example: 'V-105',
    description: 'Visitor badge/pass ID assigned at reception desk',
  })
  @IsOptional()
  @IsString({ message: 'Badge number must be a string' })
  badgeNumber?: string;

  @ApiPropertyOptional({
    example: 'Valid photo ID (Aadhaar / Driving License) not presented at security check',
    description: 'Reason if status is REJECTED',
  })
  @IsOptional()
  @IsString({ message: 'Rejection reason must be a string' })
  rejectionReason?: string;

  @ApiPropertyOptional({
    example: 'Escort provided to 2nd Floor engineering wing',
    description: 'Additional notes regarding the approval decision',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
