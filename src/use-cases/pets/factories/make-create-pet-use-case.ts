import { PrismaPetsRepository } from '@/repositories/pets/prisma/prisma-pets-repository'
import { CreatePetUseCase } from '../create-pet'
import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma/prisma-organizations-repository'
import { makeCreateFileUploadService } from '@/services/factories/make-create-file-upload-service'

export function makeCreatePetUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()
  const petsRepository = new PrismaPetsRepository()
  const fileUploadService = makeCreateFileUploadService()

  return new CreatePetUseCase(
    petsRepository,
    organizationsRepository,
    fileUploadService,
  )
}
