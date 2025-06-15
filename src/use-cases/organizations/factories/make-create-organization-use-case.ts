import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma/prisma-organizations-repository'
import { CreateOrganizationUseCase } from '../create-organization'

export function makeCreateOrganizationUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()

  return new CreateOrganizationUseCase(organizationsRepository)
}
