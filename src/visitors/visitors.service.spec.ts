import { Test, TestingModule } from '@nestjs/testing';
import { VisitorsService } from './visitors.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Role, VisitorStatus } from '@prisma/client';

describe('VisitorsService', () => {
  let service: VisitorsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    visitor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitorsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VisitorsService>(VisitorsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a visitor in PENDING status', async () => {
      const mockVisitor = {
        id: 1,
        fullName: 'Rohan Gupta',
        email: 'rohan.gupta@tcs.com',
        phone: '+91-9890123456',
        company: 'Tata Consultancy Services',
        purpose: 'Architecture Review',
        status: VisitorStatus.PENDING,
        checkInTime: new Date(),
      };

      mockPrismaService.visitor.create.mockResolvedValue(mockVisitor);

      const result = await service.create({
        fullName: 'Rohan Gupta',
        email: 'rohan.gupta@tcs.com',
        phone: '+91-9890123456',
        purpose: 'Architecture Review',
      });

      expect(result.data.fullName).toBe('Rohan Gupta');
      expect(result.data.status).toBe(VisitorStatus.PENDING);
    });
  });

  describe('findOne', () => {
    it('should return a visitor if found', async () => {
      const mockVisitor = {
        id: 1,
        fullName: 'Rohan Gupta',
        email: 'rohan.gupta@tcs.com',
        status: VisitorStatus.PENDING,
      };

      mockPrismaService.visitor.findUnique.mockResolvedValue(mockVisitor);

      const result = await service.findOne(1);
      expect(result.data.id).toBe(1);
    });

    it('should throw NotFoundException if visitor does not exist', async () => {
      mockPrismaService.visitor.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('approve', () => {
    it('should update visitor status to APPROVED with approver details', async () => {
      const mockVisitor = {
        id: 1,
        fullName: 'Rohan Gupta',
        status: VisitorStatus.PENDING,
      };

      const mockApproved = {
        id: 1,
        fullName: 'Rohan Gupta',
        status: VisitorStatus.APPROVED,
        approvedById: 1,
        badgeNumber: 'V-101',
      };

      mockPrismaService.visitor.findUnique.mockResolvedValue(mockVisitor);
      mockPrismaService.visitor.update.mockResolvedValue(mockApproved);

      const currentUser = {
        id: 1,
        email: 'admin@vms.com',
        name: 'Rahul Sharma',
        role: Role.ADMIN,
      };

      const result = await service.approve(
        1,
        { status: VisitorStatus.APPROVED, badgeNumber: 'V-101' },
        currentUser,
      );

      expect(result.data.status).toBe(VisitorStatus.APPROVED);
      expect(mockPrismaService.visitor.update).toHaveBeenCalled();
    });
  });
});
