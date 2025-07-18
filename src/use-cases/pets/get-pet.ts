import { PetsRepository } from '@/repositories/pets/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetPetUseCaseRequest {
  petId: string
}

interface GetPetUseCaseResponse {
  pet: Pet
}

export class GetPetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetPetUseCaseRequest): Promise<GetPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError('Pet')
    }

    return {
      pet,
    }
  }
}
