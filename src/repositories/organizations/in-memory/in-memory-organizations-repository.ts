import { randomUUID } from 'node:crypto'

import { Organization, Prisma, User } from '@prisma/client'

import { OrganizationsRepository } from '../organizations-repository'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  public owners: User[] = []
  public organizations: Organization[] = []

  async create(data: Prisma.OrganizationCreateInput) {
    const owner: User = {
      id: randomUUID(),
      email: 'johndoe@example.com',
      name: 'John Doe',
      password_hash: '123456',
    }

    this.owners.push(owner)

    const date = new Date()

    const organization: Organization = {
      id: randomUUID(),
      name: data.name,
      ownerId: owner.id,
      phone: data.phone,
      zipCode: data.zipCode,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      number: data.number,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: date,
      updated_at: date,
    }

    this.organizations.push(organization)

    return organization
  }

  async findOwnerByEmail(email: string) {
    const owner = this.owners.find((owner) => owner.email === email)

    if (!owner) {
      return null
    }

    return owner
  }

  async findById(id: string) {
    const organization = this.organizations.find((o) => o.id === id)

    if (!organization) {
      return null
    }

    return organization
  }
}
