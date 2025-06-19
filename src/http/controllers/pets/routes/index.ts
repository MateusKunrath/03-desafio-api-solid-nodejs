import { FastifyInstance } from 'fastify'
import { create } from '../create'
import { search } from '../search'
import { get } from '../get'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', search)
  app.get('/pets/:id', get)

  app.post('/organizations/:organizationId/pets', create)
}
