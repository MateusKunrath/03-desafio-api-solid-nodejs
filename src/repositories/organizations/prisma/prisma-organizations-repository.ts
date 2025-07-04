import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { OrganizationsRepository } from '../organizations-repository'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({
      data,
    })

    return organization
  }

  async findOwnerByEmail(email: string) {
    const owner = await prisma.user.findUnique({
      where: { email },
    })

    return owner
  }

  async findById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
    })

    return organization
  }
}
