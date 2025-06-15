import { prisma } from '@/lib/prisma'
import { OrganizationsRepository } from '@/repositories/organizations/organizations-repository'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface Owner {
  name: string
  email: string
  password: string
}

interface CreateOrganizationUseCaseRequest {
  owner: Owner
  name: string
  phone: string
  zipCode: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  latitude: number
  longitude: number
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization
}

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async execute({
    owner,
    name,
    phone,
    zipCode,
    state,
    city,
    neighborhood,
    street,
    number,
    latitude,
    longitude,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const ownerPasswordHash = await hash(owner.password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email: owner.email },
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const organization = await this.organizationsRepository.create({
      name,
      phone,
      zipCode,
      state,
      city,
      neighborhood,
      street,
      number,
      latitude,
      longitude,
      owner: {
        create: {
          name: owner.name,
          email: owner.email,
          password_hash: ownerPasswordHash,
        },
      },
    })

    return {
      organization,
    }
  }
}
