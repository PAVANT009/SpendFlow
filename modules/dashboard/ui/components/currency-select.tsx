"use client";

import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { currencyOptions } from "@/data/currency-options";

import { cn } from "@/lib/utils";

const currencies = currencyOptions;

export function CurrencySelect({ value, onChange }: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    
    const timeoutId = setTimeout(() => {
      const popoverContent = contentRef.current;
      if (!popoverContent) return;

      const commandList = popoverContent.querySelector('[data-slot="command-list"]') as HTMLElement;
      if (!commandList) return;

      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation();
      };

      const handleTouchStart = (e: TouchEvent) => {
        e.stopPropagation();
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
      };

      commandList.addEventListener('wheel', handleWheel, { passive: false });
      commandList.addEventListener('touchstart', handleTouchStart, { passive: false });
      commandList.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        commandList.removeEventListener('wheel', handleWheel);
        commandList.removeEventListener('touchstart', handleTouchStart);
        commandList.removeEventListener('touchmove', handleTouchMove);
      };
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[48%] justify-between text-sm text-muted-foreground"
        >
          {value
            ? currencies.find((c) => c.value === value)?.symbol +
              " " +
              currencies.find((c) => c.value === value)?.value
            : "Select currency"}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        ref={contentRef}
        className="p-0 w-[var(--radix-popper-anchor-width)]"
        align="start"
        sideOffset={4}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={true}>
          <CommandInput placeholder="Search currency..." />

          <CommandList 
            className="max-h-[300px] overflow-y-auto"
            style={{ 
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              willChange: 'scroll-position'
            }}
          >
            <CommandEmpty>No currency found.</CommandEmpty>

            <CommandGroup>
              {currencies.map((c) => (
                <CommandItem
                  key={c.value}
                  value={c.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="mr-2">{c.symbol}</span>
                  {c.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === c.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
