import { Organization, Prisma } from '@prisma/client'

export interface OrganizationsRepository {
  create(data: Prisma.OrganizationUncheckedCreateInput): Promise<Organization>
}
