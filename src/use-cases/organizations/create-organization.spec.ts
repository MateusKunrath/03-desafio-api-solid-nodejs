import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrganizationUseCase } from './create-organization'
import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory/in-memory-organizations-repository'

let sut: CreateOrganizationUseCase

describe('Create organization use case', () => {
  beforeEach(() => {
    sut = new CreateOrganizationUseCase(new InMemoryOrganizationsRepository())
  })

  it('should be able to create a organization', async () => {
    const { organization } = await sut.execute({
      owner: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
      name: 'Organization test',
      phone: '51999999999',
      zipCode: '99999999',
      state: 'Rio Grande do Sul',
      city: 'Harmonia',
      neighborhood: 'Morro Peixoto',
      street: 'Rua Teste',
      number: '220',
      latitude: -29.5443029,
      longitude: -51.4214456,
    })

    expect(organization.id).toEqual(expect.any(String))
  })
})
