"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface CommandSelectProps {
  value?: string;
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function CommandSelect({
  value,
  options,
  placeholder,
  onSelect,
  className,
}: CommandSelectProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "w-full border border-input px-3 py-2 rounded-md text-sm flex items-center justify-between",
          "outline-none focus:border-primary focus:ring-2 focus:ring-primary",
          className
        )}
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className="opacity-50" />
      </PopoverTrigger>

      <PopoverContent 
          className="p-0 w-[var(--radix-popper-anchor-width)]"
            style={{ touchAction: "auto" }}
        >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-64 overflow-auto">
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  onSelect={() => {
                    onSelect(o.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === o.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
