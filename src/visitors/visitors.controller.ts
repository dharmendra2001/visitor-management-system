import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { ApproveVisitorDto } from './dto/approve-visitor.dto';
import { VisitorFilterDto } from './dto/visitor-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentUserPayload } from '../common/interfaces/current-user.interface';
import { Role } from '@prisma/client';

@ApiTags('Visitor Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a New Visitor',
    description: 'Creates a new visitor entry in the system with initial status PENDING.',
  })
  @ApiResponse({
    status: 201,
    description: 'Visitor created successfully in PENDING status.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or invalid host ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async create(
    @Body() createVisitorDto: CreateVisitorDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.visitorsService.create(createVisitorDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Visitors (with search, filter & pagination)',
    description: 'Retrieve a paginated list of visitors with optional search queries and status filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of visitors retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async findAll(@Query() filterDto: VisitorFilterDto) {
    return this.visitorsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Visitor Details by ID',
    description: 'Retrieve full details for a single visitor including host and approver information.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Visitor numeric ID' })
  @ApiResponse({
    status: 200,
    description: 'Visitor found and returned.',
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor with specified ID not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitorsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Visitor Details',
    description: 'Update personal or visit information for an existing visitor.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Visitor numeric ID' })
  @ApiResponse({
    status: 200,
    description: 'Visitor updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor not found.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ) {
    return this.visitorsService.update(id, updateVisitorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete Visitor Record (Admin only)',
    description: 'Deletes a visitor record permanently from the database.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Visitor numeric ID' })
  @ApiResponse({
    status: 200,
    description: 'Visitor deleted successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Requires ADMIN role.',
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.visitorsService.remove(id);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.HOST)
  @ApiOperation({
    summary: 'Approve or Reject Visitor',
    description: 'Updates visitor status to APPROVED, REJECTED, or back to PENDING. Records approver ID and timestamp.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Visitor numeric ID' })
  @ApiResponse({
    status: 200,
    description: 'Visitor status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition or payload.',
  })
  @ApiResponse({
    status: 404,
    description: 'Visitor not found.',
  })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveVisitorDto: ApproveVisitorDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.visitorsService.approve(id, approveVisitorDto, user);
  }
}
