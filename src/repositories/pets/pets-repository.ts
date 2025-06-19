import { Pet, Prisma } from '@prisma/client'

export interface FindManyParams {
  city: string
  age?: string
  size?: string
  energyLevel?: string
  environment?: string
  independecyLevel?: string
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  searchMany(data: FindManyParams, page: number): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
}
