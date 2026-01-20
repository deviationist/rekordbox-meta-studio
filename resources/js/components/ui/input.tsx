import * as React from "react"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

interface InputWithCrossProps extends React.ComponentProps<"input"> {
  icon?: React.ReactElement,
  containerClassName?: string
  onClear?: () => void
}

function InputWithCross({
  icon,
  containerClassName,
  value,
  onChange,
  onClear,
  ...props
}: InputWithCrossProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Create a synthetic event for controlled inputs
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }
  return (
    <InputGroup className={cn(containerClassName)}>
      {icon && (
        <InputGroupAddon>
          {icon}
        </InputGroupAddon>
      )}
      <InputGroupInput value={value} onChange={onChange} {...props} />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-xs"
            className="cursor-pointer"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

export { Input, InputWithCross }
