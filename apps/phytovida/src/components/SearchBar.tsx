import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  resultCount?: number
}


export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput 
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {resultCount !== undefined && (
      <InputGroupAddon align="inline-end">{resultCount} results</InputGroupAddon>
    )}
    </InputGroup>
  )
}