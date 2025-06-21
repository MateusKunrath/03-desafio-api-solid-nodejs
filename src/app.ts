import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

import { env } from './env'

import { ZodError } from 'zod'
import { organizationsRoutes } from './http/controllers/organizations/routes'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { petsRoutes } from './http/controllers/pets/routes'
import path from 'node:path'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: {
    expiresIn: '10m',
  },
})
app.register(fastifyCookie)
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
})
app.register(fastifyStatic, {
  root: path.join(process.cwd(), env.UPLOAD_DIR || 'uploads'),
  prefix: `/${env.UPLOAD_DIR || 'uploads'}/`,
})

app.register(organizationsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
