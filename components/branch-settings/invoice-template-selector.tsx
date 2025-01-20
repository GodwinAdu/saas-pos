import React from 'react'
import { Check, CreditCard } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { InvoiceTemplatePreview } from './invoice-template-preview'

const templates = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'A classic, professional invoice layout',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A sleek and contemporary design',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A clean, streamlined invoice template',
  },
]

interface InvoiceTemplateSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function InvoiceTemplateSelector({ value, onValueChange }: InvoiceTemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        defaultValue={value}
        onValueChange={onValueChange}
        className="grid grid-cols-3 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id}>
            <RadioGroupItem
              value={template.id}
              id={template.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={template.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-2 text-primary">
                <CreditCard className="h-6 w-6" />
              </div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-center text-sm">
                {template.description}
              </CardDescription>
              <Check className={cn(
                "absolute top-3 right-3 h-5 w-5",
                value === template.id ? "opacity-100" : "opacity-0"
              )} />
            </Label>
          </div>
        ))}
      </RadioGroup>
      <InvoiceTemplatePreview template={value as 'standard' | 'modern' | 'minimal'} />
    </div>
  )
}

