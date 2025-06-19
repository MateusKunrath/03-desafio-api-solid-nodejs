import { beforeEach, describe, expect, it } from 'vitest'
import { SearchPetsUseCase } from './search-pets'
import { InMemoryPetsRepository } from '@/repositories/pets/in-memory/in-memory-pets-repository'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory/in-memory-organizations-repository'
import { randomUUID } from 'node:crypto'

let organizationsRepository: InMemoryOrganizationsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Search pets use case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    petsRepository = new InMemoryPetsRepository(organizationsRepository)

    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to search a list of pets by city', async () => {
    const organization = await organizationsRepository.create({
      name: 'Pets friendlys',
      owner: {
        connect: {
          id: randomUUID(),
        },
      },
      phone: '9999999999',
      zipCode: '99999999',
      state: 'New York',
      city: 'New York',
      neighborhood: 'Teste',
      street: 'Rua teste',
      number: '220',
      latitude: -29.5443029,
      longitude: -51.4214456,
    })

    await petsRepository.create({
      name: 'Rex',
      about: 'Rex is a best pet',
      age: 'ADULT',
      size: 'MEDIUM',
      energy_level: 'MEDIUM',
      environment: 'OUTDOOR',
      independency_level: 'SOMEWHAT_DEPENDENT',
      organization_id: organization.id,
    })

    await petsRepository.create({
      name: 'Rex',
      about: 'Rex is a best pet',
      age: 'ADULT',
      size: 'MEDIUM',
      energy_level: 'MEDIUM',
      environment: 'OUTDOOR',
      independency_level: 'SOMEWHAT_DEPENDENT',
      organization_id: randomUUID(),
    })

    const { pets } = await sut.execute({ query: { city: 'New York' }, page: 1 })

    expect(pets).toHaveLength(1)
  })

  it('should be able to fetch paginated pets search', async () => {
    const organization = await organizationsRepository.create({
      name: 'Pets friendlys',
      owner: {
        connect: {
          id: randomUUID(),
        },
      },
      phone: '9999999999',
      zipCode: '99999999',
      state: 'New York',
      city: 'New York',
      neighborhood: 'Teste',
      street: 'Rua teste',
      number: '220',
      latitude: -29.5443029,
      longitude: -51.4214456,
    })

    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        name: `Rex ${i}`,
        about: `Rex ${i} is a best pet`,
        age: 'ADULT',
        size: 'MEDIUM',
        energy_level: 'MEDIUM',
        environment: 'OUTDOOR',
        independency_level: 'SOMEWHAT_DEPENDENT',
        organization_id: organization.id,
      })
    }

    const { pets } = await sut.execute({ query: { city: 'New York' }, page: 2 })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Rex 21' }),
      expect.objectContaining({ name: 'Rex 22' }),
    ])
  })

  it('should be able to fetch pets searching by age', async () => {
    const organization = await organizationsRepository.create({
      name: 'Pets friendlys',
      owner: {
        connect: {
          id: randomUUID(),
        },
      },
      phone: '9999999999',
      zipCode: '99999999',
      state: 'New York',
      city: 'New York',
      neighborhood: 'Teste',
      street: 'Rua teste',
      number: '220',
      latitude: -29.5443029,
      longitude: -51.4214456,
    })

    await petsRepository.create({
      name: 'Rex',
      about: `Rex is a best pet`,
      age: 'ADULT',
      size: 'MEDIUM',
      energy_level: 'MEDIUM',
      environment: 'OUTDOOR',
      independency_level: 'SOMEWHAT_DEPENDENT',
      organization_id: organization.id,
    })

    await petsRepository.create({
      name: 'Totó',
      about: 'Totó is a good friend',
      age: 'ADULT',
      size: 'MEDIUM',
      energy_level: 'MEDIUM',
      environment: 'OUTDOOR',
      independency_level: 'SOMEWHAT_DEPENDENT',
      organization_id: organization.id,
    })

    await petsRepository.create({
      name: 'Snoopy',
      about: 'Snoopy is a good boy',
      age: 'PUPPY',
      size: 'MEDIUM',
      energy_level: 'MEDIUM',
      environment: 'OUTDOOR',
      independency_level: 'SOMEWHAT_DEPENDENT',
      organization_id: organization.id,
    })

    const { pets } = await sut.execute({
      query: { city: 'New York', age: 'PUPPY' },
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Snoopy' })])
  })
})
