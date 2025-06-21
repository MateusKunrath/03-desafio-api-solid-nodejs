import { OrganizationsRepository } from '@/repositories/organizations/organizations-repository'
import { PetsRepository } from '@/repositories/pets/pets-repository'
import {
  FileUploadService,
  UploadedFile,
  UploadResult,
} from '@/services/file-upload-service'
import {
  Pet,
  PetAge,
  PetEnergyLevel,
  PetEnvironment,
  PetIndependencyLevel,
  PetSize,
} from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: PetAge
  size: PetSize
  energyLevel: PetEnergyLevel
  environment: PetEnvironment
  independencyLevel: PetIndependencyLevel
  organizationId: string
  photos: UploadedFile[]
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energyLevel,
    environment,
    independencyLevel,
    organizationId,
    photos,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      throw new ResourceNotFoundError('Organization')
    }

    const uploadedPhotos: UploadResult[] = []

    try {
      for (const photo of photos) {
        const result = await this.fileUploadService.uploadFile(photo, 'pets')
        uploadedPhotos.push(result)
      }

      const pet = await this.petsRepository.create({
        name,
        about,
        age,
        size,
        energy_level: energyLevel,
        environment,
        independency_level: independencyLevel,
        organization_id: organizationId,
        PetImages: {
          createMany: {
            data: uploadedPhotos.map((p) => ({
              url: p.url,
            })),
          },
        },
      })

      return {
        pet,
      }
    } catch (error) {
      for (const photo of uploadedPhotos) {
        try {
          await this.fileUploadService.deleteFile(photo.fileName, 'pets')
        } catch (deleteError) {
          console.error('Erro at delete photo before failed', deleteError)
        }
      }
      throw error
    }
  }
}
