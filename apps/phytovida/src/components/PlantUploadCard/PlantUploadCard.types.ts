export interface PlantUploadCardProps {
  onUpload: (file: File) => void
  title?: string
  subtitle?: string
  accept?: string,
  className?: string
}