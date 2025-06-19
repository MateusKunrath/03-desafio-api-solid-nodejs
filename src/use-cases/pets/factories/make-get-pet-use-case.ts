import { PrismaPetsRepository } from '@/repositories/pets/prisma/prisma-pets-repository'
import { GetPetUseCase } from '../get-pet'

export function makeGetPetUseCase() {
  const petsRepository = new PrismaPetsRepository()

  return new GetPetUseCase(petsRepository)
}
