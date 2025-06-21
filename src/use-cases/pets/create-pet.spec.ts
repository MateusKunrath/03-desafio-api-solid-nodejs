import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/pets/in-memory/in-memory-pets-repository'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory/in-memory-organizations-repository'
import { LocalFileUploadService } from '@/services/local-file-upload/local-file-upload-service'
import { Prisma } from '@prisma/client'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let fileUploadService: LocalFileUploadService
let sut: CreatePetUseCase

describe('Create organization use case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    petsRepository = new InMemoryPetsRepository(organizationsRepository)
    fileUploadService = new LocalFileUploadService()

    sut = new CreatePetUseCase(
      petsRepository,
      organizationsRepository,
      fileUploadService,
    )
  })

  it('should be able to create a organization', async () => {
    organizationsRepository.organizations.push({
      id: 'organization-01',
      name: 'Teste',
      city: 'Teste',
      street: 'Teste',
      state: 'Teste',
      phone: 'Teste',
      zipCode: 'Teste',
      neighborhood: 'Teste',
      number: 'Teste',
      ownerId: 'Teste',
      created_at: new Date(),
      updated_at: new Date(),
      latitude: new Prisma.Decimal('0'),
      longitude: new Prisma.Decimal('0'),
    })

    const { pet } = await sut.execute({
      name: 'Frederico',
      about: 'Cachorro dócil',
      age: 'ADULT',
      size: 'LARGE',
      energyLevel: 'CRAZY',
      environment: 'OUTDOOR',
      independencyLevel: 'TOTALLY_INDEPENDENT',
      organizationId: 'organization-01',
      photos: [],
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
