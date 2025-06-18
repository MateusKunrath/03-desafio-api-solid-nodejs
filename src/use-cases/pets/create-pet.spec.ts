import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/pets/in-memory/in-memory-pets-repository'

let sut: CreatePetUseCase

describe('Create organization use case', () => {
  beforeEach(() => {
    sut = new CreatePetUseCase(new InMemoryPetsRepository())
  })

  it('should be able to create a organization', async () => {
    const { pet } = await sut.execute({
      name: 'Frederico',
      about: 'Cachorro dócil',
      age: 'ADULT',
      size: 'LARGE',
      energyLevel: 'CRAZY',
      environment: 'OUTDOOR',
      independencyLevel: 'TOTALLY_INDEPENDENT',
      organizationId: 'organization-01',
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
