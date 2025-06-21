import path from 'node:path'
import { FileUploadService, UploadedFile } from '../file-upload-service'
import fs, { mkdir } from 'fs/promises'
import { randomUUID } from 'node:crypto'

export class LocalFileUploadService implements FileUploadService {
  constructor(private readonly baseDir = 'uploads') {}

  async uploadFile(file: UploadedFile, folder: string) {
    const uploadDir = path.join(process.cwd(), this.baseDir, folder)
    await mkdir(uploadDir, { recursive: true })

    const fileExtension = path.extname(file.fileName)
    const fileName = `${randomUUID()}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, file.file)

    return {
      fileName,
      url: `/${this.baseDir}/${folder}/${fileName}`,
    }
  }

  async deleteFile(fileName: string, folder: string) {
    const filePath = path.join(process.cwd(), this.baseDir, folder, fileName)

    try {
      fs.unlink(filePath)
    } catch (error) {
      console.error(`Error at delete file ${fileName}:`, error)
    }
  }
}
