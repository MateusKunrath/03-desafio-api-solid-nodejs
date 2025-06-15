import { randomUUID } from 'node:crypto'

import { Organization, Prisma } from '@prisma/client'

import { OrganizationsRepository } from '../organizations-repository'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  public organizations: Organization[] = []

  async create(data: Prisma.OrganizationCreateInput) {
    const ownerId = randomUUID()
    const date = new Date()

    const organization: Organization = {
      id: randomUUID(),
      name: data.name,
      ownerId,
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
}
