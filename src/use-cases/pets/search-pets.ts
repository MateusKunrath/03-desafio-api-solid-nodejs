import { PetsRepository } from '@/repositories/pets/pets-repository'
import { Pet } from '@prisma/client'

interface SearchPetsQuery {
  city: string
  age?: string
  size?: string
  energyLevel?: string
  environment?: string
  independecyLevel?: string
}

interface SearchPetsUseCaseRequest {
  query: SearchPetsQuery
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute({
    query,
    page,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.searchMany(
      {
        city: query.city,
        age: query.age,
        size: query.size,
        energyLevel: query.energyLevel,
        environment: query.environment,
        independecyLevel: query.independecyLevel,
      },
      page,
    )

    return {
      pets,
    }
  }
}
