import React from 'react'
import { Textarea } from "@/components/ui/textarea"

function TextAreaField({ item, handleInputChange, carInfo, formData }) {
  return (
    <div>
      <Textarea
        required={item.required}
        value={formData?.[item.name] ?? ""}
        onChange={(e) => handleInputChange(item.name, e.target.value)}
      />
    </div>
  )
}

export default TextAreaField