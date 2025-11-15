import * as React from "react"

export const MyInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          h-8
          w-full rounded-md border border-input bg-background 
          px-3 py-1.5 text-sm text-foreground
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          ${className}
        `}
        {...props}
      />
    )
  }
)

MyInput.displayName = "MyInput"
