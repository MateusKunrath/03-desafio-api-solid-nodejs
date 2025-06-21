import { Organization, Prisma, User } from '@prisma/client'

export interface OrganizationsRepository {
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
  findOwnerByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<Organization | null>
}
