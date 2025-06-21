import { env } from '@/env'
import { LocalFileUploadService } from '../local-file-upload/local-file-upload-service'

export function makeCreateFileUploadService() {
  // const uploadProvider = env.UPLOAD_PROVIDER || 'local'

  return new LocalFileUploadService(env.UPLOAD_DIR)
}
