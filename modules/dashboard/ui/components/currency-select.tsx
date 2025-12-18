
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useCurrency } from "@/currency-context";
import { cn } from "@/lib/utils";

type CurrencySelectProps = {
  disabled?: boolean;
};

const currencies = currencyOptions;

export function CurrencySelect({ disabled = false }: CurrencySelectProps) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || disabled) return;

    const timeoutId = setTimeout(() => {
      const popoverContent = contentRef.current;
      if (!popoverContent) return;

      const commandList = popoverContent.querySelector(
        '[data-slot="command-list"]'
      ) as HTMLElement | null;

      if (!commandList) return;

      const stop = (e: Event) => e.stopPropagation();

      commandList.addEventListener("wheel", stop, { passive: false });
      commandList.addEventListener("touchstart", stop, { passive: false });
      commandList.addEventListener("touchmove", stop, { passive: false });

      return () => {
        commandList.removeEventListener("wheel", stop);
        commandList.removeEventListener("touchstart", stop);
        commandList.removeEventListener("touchmove", stop);
      };
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [open, disabled]);

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={(v) => {
        if (!disabled) setOpen(v);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          title={disabled ? "Currency cannot be changed" : undefined}
          className={cn(
            "w-full justify-between text-sm",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "text-muted-foreground"
          )}
        >
          {currency
            ? `${currencies.find((c) => c.value === currency)?.symbol} ${
                currencies.find((c) => c.value === currency)?.value
              }`
            : "Select currency"}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent
          ref={contentRef}
          className="p-0 w-[var(--radix-popper-anchor-width)]"
          align="start"
          sideOffset={4}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <Command shouldFilter>
            <CommandInput placeholder="Search currency..." />

            <CommandList
              className="max-h-[300px] overflow-y-auto"
              style={{
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
              }}
            >
              <CommandEmpty>No currency found.</CommandEmpty>

              <CommandGroup>
                {currencies.map((c) => (
                  <CommandItem
                    key={c.value}
                    value={c.value}
                    onSelect={(val) => {
                      setCurrency(val === currency ? "" : val);
                      setOpen(false);
                    }}
                  >
                    <span className="mr-2">{c.symbol}</span>
                    {c.value}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currency === c.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}


// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Button } from "@/components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { currencyOptions } from "@/data/currency-options";
// import { useCurrency } from "@/currency-context";
// import { cn } from "@/lib/utils";

// const currencies = currencyOptions;

// export function CurrencySelect() {
//   const { currency, setCurrency } = useCurrency();
//   const [open, setOpen] = useState(false);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!open) return;
    
//     const timeoutId = setTimeout(() => {
//       const popoverContent = contentRef.current;
//       if (!popoverContent) return;

//       const commandList = popoverContent.querySelector('[data-slot="command-list"]') as HTMLElement;
//       if (!commandList) return;

//       const handleWheel = (e: WheelEvent) => {
//         e.stopPropagation();
//       };

//       const handleTouchStart = (e: TouchEvent) => {
//         e.stopPropagation();
//       };

//       const handleTouchMove = (e: TouchEvent) => {
//         e.stopPropagation();
//       };

//       commandList.addEventListener('wheel', handleWheel, { passive: false });
//       commandList.addEventListener('touchstart', handleTouchStart, { passive: false });
//       commandList.addEventListener('touchmove', handleTouchMove, { passive: false });

//       return () => {
//         commandList.removeEventListener('wheel', handleWheel);
//         commandList.removeEventListener('touchstart', handleTouchStart);
//         commandList.removeEventListener('touchmove', handleTouchMove);
//       };
//     }, 0);

//     return () => clearTimeout(timeoutId);
//   }, [open]);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between text-sm text-muted-foreground"
//         >
//           {currency
//             ? currencies.find((c) => c.value === currency)?.symbol +
//               " " +
//               currencies.find((c) => c.value === currency)?.value
//             : "Select currency"}
//           <ChevronsUpDown className="h-4 w-4 opacity-50" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent
//         ref={contentRef}
//         className="p-0 w-[var(--radix-popper-anchor-width)]"
//         align="start"
//         sideOffset={4}
//         onWheel={(e) => e.stopPropagation()}
//         onTouchMove={(e) => e.stopPropagation()}
//       >
//         <Command shouldFilter={true}>
//           <CommandInput placeholder="Search currency..." />

//           <CommandList 
//             className="max-h-[300px] overflow-y-auto"
//             style={{ 
//               overscrollBehavior: 'contain',
//               WebkitOverflowScrolling: 'touch',
//               touchAction: 'pan-y',
//               willChange: 'scroll-position'
//             }}
//           >
//             <CommandEmpty>No currency found.</CommandEmpty>

//             <CommandGroup>
//               {currencies.map((c) => (
//                 <CommandItem
//                   key={c.value}
//                   value={c.value}
//                   onSelect={(currentValue) => {
//                     setCurrency(currentValue === currency ? "" : currentValue);
//                     setOpen(false);
//                   }}
//                 >
//                   <span className="mr-2">{c.symbol}</span>
//                   {/* {c.label} */}
//                   {c.value}
//                   <Check
//                     className={cn(
//                       "ml-auto h-4 w-4",
//                       currency === c.value ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }
