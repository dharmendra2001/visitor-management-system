import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { ApproveVisitorDto } from './dto/approve-visitor.dto';
import { VisitorFilterDto } from './dto/visitor-filter.dto';
import { CurrentUserPayload } from '../common/interfaces/current-user.interface';

@Injectable()
export class VisitorsService {
  constructor(private prisma: PrismaService) {}

  async create(createVisitorDto: CreateVisitorDto, currentUser?: CurrentUserPayload) {
    if (createVisitorDto.hostUserId) {
      const host = await this.prisma.user.findUnique({
        where: { id: createVisitorDto.hostUserId },
      });
      if (!host) {
        throw new BadRequestException(
          `Host user with ID ${createVisitorDto.hostUserId} does not exist`,
        );
      }
    }

    const checkInDate = createVisitorDto.checkInTime
      ? new Date(createVisitorDto.checkInTime)
      : new Date();

    const visitor = await this.prisma.visitor.create({
      data: {
        fullName: createVisitorDto.fullName,
        email: createVisitorDto.email.toLowerCase(),
        phone: createVisitorDto.phone,
        company: createVisitorDto.company,
        purpose: createVisitorDto.purpose,
        hostUserId: createVisitorDto.hostUserId,
        hostName: createVisitorDto.hostName,
        badgeNumber: createVisitorDto.badgeNumber,
        checkInTime: checkInDate,
        notes: createVisitorDto.notes,
        status: 'PENDING',
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });

    return {
      message: 'Visitor registered successfully in PENDING status',
      data: visitor,
    };
  }

  async findAll(filterDto: VisitorFilterDto) {
    const {
      search,
      status,
      hostUserId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filterDto;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.VisitorWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (hostUserId) {
      where.hostUserId = Number(hostUserId);
    }

    if (startDate || endDate) {
      where.checkInTime = {};
      if (startDate) {
        where.checkInTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.checkInTime.lte = new Date(endDate);
      }
    }

    if (search) {
      const trimmedSearch = search.trim();
      where.OR = [
        { fullName: { contains: trimmedSearch } },
        { email: { contains: trimmedSearch } },
        { phone: { contains: trimmedSearch } },
        { company: { contains: trimmedSearch } },
        { badgeNumber: { contains: trimmedSearch } },
        { purpose: { contains: trimmedSearch } },
      ];
    }

    const [total, visitors] = await Promise.all([
      this.prisma.visitor.count({ where }),
      this.prisma.visitor.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
              phone: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      message: 'Visitors retrieved successfully',
      data: visitors,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  async findOne(id: number) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id: Number(id) },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            phone: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    return {
      message: 'Visitor details retrieved successfully',
      data: visitor,
    };
  }

  async update(id: number, updateVisitorDto: UpdateVisitorDto) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id: Number(id) },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    if (updateVisitorDto.hostUserId) {
      const host = await this.prisma.user.findUnique({
        where: { id: updateVisitorDto.hostUserId },
      });
      if (!host) {
        throw new BadRequestException(
          `Host user with ID ${updateVisitorDto.hostUserId} does not exist`,
        );
      }
    }

    const data: Prisma.VisitorUpdateInput = {
      ...(updateVisitorDto.fullName && { fullName: updateVisitorDto.fullName }),
      ...(updateVisitorDto.email && { email: updateVisitorDto.email.toLowerCase() }),
      ...(updateVisitorDto.phone && { phone: updateVisitorDto.phone }),
      ...(updateVisitorDto.company !== undefined && { company: updateVisitorDto.company }),
      ...(updateVisitorDto.purpose && { purpose: updateVisitorDto.purpose }),
      ...(updateVisitorDto.status && { status: updateVisitorDto.status }),
      ...(updateVisitorDto.hostName !== undefined && { hostName: updateVisitorDto.hostName }),
      ...(updateVisitorDto.badgeNumber !== undefined && { badgeNumber: updateVisitorDto.badgeNumber }),
      ...(updateVisitorDto.checkInTime && { checkInTime: new Date(updateVisitorDto.checkInTime) }),
      ...(updateVisitorDto.checkOutTime && { checkOutTime: new Date(updateVisitorDto.checkOutTime) }),
      ...(updateVisitorDto.notes !== undefined && { notes: updateVisitorDto.notes }),
      ...(updateVisitorDto.rejectionReason !== undefined && { rejectionReason: updateVisitorDto.rejectionReason }),
    };

    if (updateVisitorDto.hostUserId !== undefined) {
      data.host = updateVisitorDto.hostUserId
        ? { connect: { id: updateVisitorDto.hostUserId } }
        : { disconnect: true };
    }

    const updated = await this.prisma.visitor.update({
      where: { id: Number(id) },
      data,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      message: 'Visitor updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id: Number(id) },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    await this.prisma.visitor.delete({
      where: { id: Number(id) },
    });

    return {
      message: `Visitor with ID ${id} deleted successfully`,
      data: { id: Number(id) },
    };
  }

  async approve(
    id: number,
    approveVisitorDto: ApproveVisitorDto,
    currentUser: CurrentUserPayload,
  ) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id: Number(id) },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    const isDecisionFinal =
      approveVisitorDto.status === 'APPROVED' ||
      approveVisitorDto.status === 'REJECTED';

    const updated = await this.prisma.visitor.update({
      where: { id: Number(id) },
      data: {
        status: approveVisitorDto.status,
        ...(isDecisionFinal
          ? {
              approvedById: currentUser.id,
              approvedAt: new Date(),
            }
          : {
              approvedById: null,
              approvedAt: null,
            }),
        ...(approveVisitorDto.badgeNumber !== undefined && {
          badgeNumber: approveVisitorDto.badgeNumber,
        }),
        ...(approveVisitorDto.rejectionReason !== undefined && {
          rejectionReason: approveVisitorDto.rejectionReason,
        }),
        ...(approveVisitorDto.notes !== undefined && {
          notes: approveVisitorDto.notes,
        }),
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      message: `Visitor status successfully updated to ${approveVisitorDto.status}`,
      data: updated,
    };
  }
}
