type DescriptionInput = string | { value: string } | null | undefined
 
export function normalizeDescription(description: DescriptionInput): string {
  if (!description) return 'No description available.'
  if (typeof description === 'string') return description
  if (typeof description === 'object' && 'value' in description) return description.value
  return 'No description available.'
}