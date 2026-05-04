const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 25
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
 
export function validateFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG or WebP images are supported.')
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`Image must be under ${MAX_SIZE_MB} MB.`)
  }
}
export default validateFile;
