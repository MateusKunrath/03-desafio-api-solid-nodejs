export class ResourceNotFoundError extends Error {
  constructor(resourse: string) {
    super(`${resourse} not found`)
  }
}
