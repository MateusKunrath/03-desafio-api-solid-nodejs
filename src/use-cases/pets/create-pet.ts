import { PetsRepository } from '@/repositories/pets/pets-repository'
import {
  Pet,
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependencyLevel,
} from '@prisma/client'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: PetAge
  energyLevel: PetEnergyLevel
  environment: PetEnvironment
  independencyLevel: PetIndependencyLevel
  organizationId: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute({
    name,
    about,
    age,
    energyLevel,
    environment,
    independencyLevel,
    organizationId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      energy_level: energyLevel,
      environment,
      independency_level: independencyLevel,
      organization_id: organizationId,
    })

    return {
      pet,
    }
  }
}
