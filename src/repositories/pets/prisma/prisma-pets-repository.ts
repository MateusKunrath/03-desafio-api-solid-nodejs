import {
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependencyLevel,
  PetSize,
  Prisma,
} from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { FindManyParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async searchMany(data: FindManyParams, page: number) {
    const pets = await prisma.pet.findMany({
      where: {
        age: data.age as PetAge,
        size: data.size as PetSize,
        energy_level: data.energyLevel as PetEnergyLevel,
        environment: data.environment as PetEnvironment,
        independency_level: data.independecyLevel as PetIndependencyLevel,
        organization: {
          city: {
            contains: data.city,
            mode: 'insensitive',
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        organization: true,
      },
    })

    return pets
  }
}
