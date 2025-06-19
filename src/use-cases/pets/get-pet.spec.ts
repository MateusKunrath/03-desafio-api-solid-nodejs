import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/pets/in-memory/in-memory-pets-repository'
import { GetPetUseCase } from './get-pet'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory/in-memory-organizations-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let sut: GetPetUseCase

describe('Get Pet Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository(
      new InMemoryOrganizationsRepository(),
    )

    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a pet by id', async () => {
    const createdPet = await petsRepository.create({
      name: 'Rex',
      about: 'About',
      age: 'ADULT',
      size: 'GIANT',
      energy_level: 'CRAZY',
      environment: 'ANY',
      independency_level: 'FAIRLY_INDEPENDENT',
      organization_id: randomUUID(),
    })

    const { pet } = await sut.execute({
      petId: createdPet.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toEqual('Rex')
  })

  it('should not be able to get a pet with wrong id', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
