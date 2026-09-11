import { PrismaClient, Role, VisitorStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.visitor.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
  const receptionistPassword = await bcrypt.hash('Staff@123', saltRounds);
  const hostPassword = await bcrypt.hash('Host@123', saltRounds);

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'admin@vms.com',
      password: adminPassword,
      role: Role.ADMIN,
      department: 'IT Infrastructure',
      phone: '+91-9876543210',
    },
  });

  // 2. Receptionist
  const receptionist = await prisma.user.create({
    data: {
      name: 'Pooja Verma',
      email: 'receptionist@vms.com',
      password: receptionistPassword,
      role: Role.RECEPTIONIST,
      department: 'Front Desk / Admin',
      phone: '+91-9812345678',
    },
  });

  // 3. Employee Host
  const host = await prisma.user.create({
    data: {
      name: 'Amit Patel',
      email: 'amit.patel@vms.com',
      password: hostPassword,
      role: Role.HOST,
      department: 'Engineering',
      phone: '+91-9823456789',
    },
  });

  // 4. Sample Visitors
  await prisma.visitor.createMany({
    data: [
      {
        fullName: 'Rohan Gupta',
        email: 'rohan.gupta@tcs.com',
        phone: '+91-9890123456',
        company: 'Tata Consultancy Services',
        purpose: 'Sprint Planning & Architecture Discussion',
        hostUserId: host.id,
        status: VisitorStatus.PENDING,
        checkInTime: new Date(Date.now() - 30 * 60 * 1000),
        notes: 'Needs guest Wi-Fi access for demo laptop',
      },
      {
        fullName: 'Priya Nair',
        email: 'priya.nair@infosys.com',
        phone: '+91-9765432109',
        company: 'Infosys Ltd',
        purpose: 'Client Partner Meeting',
        hostUserId: host.id,
        badgeNumber: 'V-101',
        status: VisitorStatus.APPROVED,
        checkInTime: new Date(Date.now() - 2 * 3600 * 1000),
        approvedById: admin.id,
        approvedAt: new Date(Date.now() - 110 * 60 * 1000),
        notes: 'Issued Visitor Pass V-101 at reception desk',
      },
      {
        fullName: 'Vikram Singh',
        email: 'vikram.singh@wipro.com',
        phone: '+91-9988776655',
        company: 'Wipro Technologies',
        purpose: 'Hardware & Server Room Maintenance',
        hostUserId: host.id,
        status: VisitorStatus.REJECTED,
        checkInTime: new Date(Date.now() - 4 * 3600 * 1000),
        approvedById: admin.id,
        approvedAt: new Date(Date.now() - 3.8 * 3600 * 1000),
        rejectionReason: 'Government ID verification (Aadhaar/PAN) could not be verified by security team.',
        notes: 'Advised to bring original ID card on next visit.',
      },
      {
        fullName: 'Ananya Deshmukh',
        email: 'ananya.d@fintechsolutions.in',
        phone: '+91-9123456780',
        company: 'FinTech Solutions Mumbai',
        purpose: 'Payment Gateway Integration Discussion',
        hostName: 'Suresh Menon',
        status: VisitorStatus.PENDING,
        checkInTime: new Date(),
        notes: 'Meeting in 2nd Floor Conference Room A',
      },
    ],
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
