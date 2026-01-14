import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { X } from "lucide-react"

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
  containerClassName?: string
  onClear?: () => void
}

function InputWithCross({
  className,
  containerClassName,
  type,
  value,
  onChange,
  onClear,
  ...props
}: InputWithCrossProps) {
  const handleClear = () => {
    if (onClear) {
      onClear()
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
    <div className={cn("relative", containerClassName)}>
      <Input
        type={type}
        className={cn("pr-10", className)}
        value={value}
        onChange={onChange}
        {...props}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute cursor-pointer right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={handleClear}
          tabIndex={-1}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  )
}

export { Input, InputWithCross }
