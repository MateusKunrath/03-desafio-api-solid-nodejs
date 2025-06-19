import { FastifyInstance } from 'fastify'
import { create } from '../create'
import { search } from '../search'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/organizations/:organizationId/pets', create)
  app.get('/pets', search)
}
