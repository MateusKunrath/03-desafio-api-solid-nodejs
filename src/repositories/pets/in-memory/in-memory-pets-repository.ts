import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      energy_level: data.energy_level,
      environment: data.environment,
      independency_level: data.independency_level,
      created_at: new Date(),
      organization_id: data.organization_id,
    }

    this.pets.push(pet)

    return pet
  }
}
