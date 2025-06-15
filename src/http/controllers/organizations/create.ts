import { makeCreateOrganizationUseCase } from '@/use-cases/organizations/factories/make-create-organization-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrganizationBodySchema = z.object({
    owner: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    }),
    name: z.string(),
    phone: z.string(),
    zipCode: z.string(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    number: z.string(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
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
  } = createOrganizationBodySchema.parse(request.body)

  const createOrganizationUseCase = makeCreateOrganizationUseCase()

  await createOrganizationUseCase.execute({
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
  })

  return reply.status(201).send()
}
