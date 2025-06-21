export interface UploadedFile {
  fileName: string
  mimetype: string
  file: Buffer
}

export interface UploadResult {
  fileName: string
  url: string
}

export interface FileUploadService {
  uploadFile(file: UploadedFile, folder: string): Promise<UploadResult>
  deleteFile(fileName: string, folder: string): Promise<void>
}
