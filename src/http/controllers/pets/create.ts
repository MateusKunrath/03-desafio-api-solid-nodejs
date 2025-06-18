import { FastifyReply, FastifyRequest } from 'fastify'
import {
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependencyLevel,
  PetSize,
} from '@prisma/client'
import { z } from 'zod'

import { makeCreatePetUseCase } from '@/use-cases/pets/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetParamsSchema = z.object({
    organizationId: z.string().uuid(),
  })

  const createPetBodySchema = z.object({
    name: z.string().min(3),
    about: z.string().min(10),
    age: z.enum(Object.values(PetAge) as [string, ...string[]]),
    size: z.enum(Object.values(PetSize) as [string, ...string[]]),
    energyLevel: z.enum(Object.values(PetEnergyLevel) as [string, ...string[]]),
    environment: z.enum(Object.values(PetEnvironment) as [string, ...string[]]),
    independencyLevel: z.enum(
      Object.values(PetIndependencyLevel) as [string, ...string[]],
    ),
  })

  const { organizationId } = createPetParamsSchema.parse(request.params)

  const {
    name,
    about,
    age,
    size,
    energyLevel,
    environment,
    independencyLevel,
  } = createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    name,
    about,
    age: age as PetAge,
    size: size as PetSize,
    energyLevel: energyLevel as PetEnergyLevel,
    environment: environment as PetEnvironment,
    independencyLevel: independencyLevel as PetIndependencyLevel,
    organizationId,
  })

  reply.status(201).send()
}
