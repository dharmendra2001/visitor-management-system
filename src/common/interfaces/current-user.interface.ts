import { Role } from '@prisma/client';

export interface CurrentUserPayload {
  id: number;
  email: string;
  name: string;
  role: Role;
  department?: string;
}
