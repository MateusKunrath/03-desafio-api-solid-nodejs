import { Pet, Prisma } from '@prisma/client'
import { FindManyParams, PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory/in-memory-organizations-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = []

  constructor(
    private readonly organizationsRepository: InMemoryOrganizationsRepository,
  ) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      environment: data.environment,
      independency_level: data.independency_level,
      created_at: new Date(),
      organization_id: data.organization_id,
    }

    this.pets.push(pet)

    return pet
  }

  async searchMany(data: FindManyParams, page: number) {
    const organizationsInCity =
      this.organizationsRepository.organizations.filter((org) =>
        org.city.includes(data.city),
      )

    const pets = this.pets
      .filter((pet) =>
        organizationsInCity.some((org) => org.id === pet.organization_id),
      )
      .filter((pet) => (data.age ? pet.age === data.age : true))
      .filter((pet) => (data.size ? pet.size === data.size : true))
      .filter((pet) =>
        data.energyLevel ? pet.energy_level === data.energyLevel : true,
      )
      .filter((pet) =>
        data.environment ? pet.environment === data.environment : true,
      )
      .filter((pet) =>
        data.independecyLevel
          ? pet.independency_level === data.independecyLevel
          : true,
      )
      .slice((page - 1) * 20, page * 20)

    return pets
  }

  async findById(id: string) {
    const pet = this.pets.find((pet) => pet.id === id)

    if (!pet) {
      return null
    }

    return pet
  }
}
