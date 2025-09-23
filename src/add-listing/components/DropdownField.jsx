import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function DropdownField({ item, handleInputChange, carInfo, formData }) {
  return (
    <div>
      <Select
        required={item.required}
        value={formData?.[item.name] ?? ""}
        onValueChange={(value) => handleInputChange(item.name, value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={item.label} />
        </SelectTrigger>
        <SelectContent>
          {item?.options?.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DropdownField