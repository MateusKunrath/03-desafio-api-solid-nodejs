import { makeSearchPetsUseCase } from '@/use-cases/pets/factories/make-search-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetQuerySchema = z.object({
    city: z.string().min(1),
    age: z.string().optional(),
    size: z.string().optional(),
    energy_level: z.string().optional(),
    environment: z.string().optional(),
    independency_level: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
  })

  const {
    city,
    age,
    size,
    energy_level,
    environment,
    independency_level,
    page,
  } = searchPetQuerySchema.parse(request.query)

  const searchPetUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetUseCase.execute({
    query: {
      city,
      age,
      size,
      energyLevel: energy_level,
      environment,
      independecyLevel: independency_level,
    },
    page,
  })

  return reply.status(200).send({ pets })
}
