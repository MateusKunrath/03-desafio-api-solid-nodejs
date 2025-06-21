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
import { UploadedFile } from '@/services/file-upload-service'

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

interface PetFormData {
  name: string
  about: string
  age: PetAge
  size: PetSize
  energyLevel: PetEnergyLevel
  environment: PetEnvironment
  independencyLevel: PetIndependencyLevel
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  if (!request.isMultipart()) {
    return reply.status(400).send({
      error: 'Request must be multipart/form-data',
    })
  }

  const formData: Record<string, string> = {}
  const photos: UploadedFile[] = []

  const parts = request.parts()

  for await (const part of parts) {
    if (part.type === 'field') {
      if (isPetFormDataField(part.fieldname)) {
        formData[part.fieldname as keyof PetFormData] = part.value as string
      }
    } else if (part.type === 'file') {
      if (part.fieldname === 'photos') {
        if (!part.mimetype.startsWith('image/')) {
          part.file.resume()
          return reply.status(400).send({
            error: `File ${part.filename} is not a valid image`,
          })
        }

        const buffer = await part.toBuffer()

        photos.push({
          fileName: part.filename,
          mimetype: part.mimetype,
          file: buffer,
        })
      } else {
        part.file.resume()
      }
    }
  }

  const { organizationId } = createPetParamsSchema.parse(request.params)

  const petData = {
    name: formData.name!,
    about: formData.about!,
    age: formData.age! as PetAge,
    size: formData.size! as PetSize,
    energyLevel: formData.energyLevel! as PetEnergyLevel,
    environment: formData.environment! as PetEnvironment,
    independencyLevel: formData.independencyLevel! as PetIndependencyLevel,
    photos,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { photos: _photos, ...dataToValidate } = petData
  const validatedData = createPetBodySchema.parse(dataToValidate)

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    name: validatedData.name,
    about: validatedData.about,
    age: validatedData.age as PetAge,
    size: validatedData.size as PetSize,
    energyLevel: validatedData.energyLevel as PetEnergyLevel,
    environment: validatedData.environment as PetEnvironment,
    independencyLevel: validatedData.independencyLevel as PetIndependencyLevel,
    organizationId,
    photos: petData.photos,
  })

  reply.status(201).send()
}

function isPetFormDataField(field: string): field is keyof PetFormData {
  const validFields: (keyof PetFormData)[] = [
    'name',
    'age',
    'about',
    'size',
    'energyLevel',
    'environment',
    'independencyLevel',
  ]
  return validFields.includes(field as keyof PetFormData)
}
