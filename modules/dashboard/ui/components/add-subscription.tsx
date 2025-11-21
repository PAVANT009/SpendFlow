// AddSubscription.tsx
"use client";

import { useState } from "react";
import CompanySearch from "./company-search";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter, 
  SheetClose,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AddSubscription() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-end mb-9">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <span className="text-2xl font-light leading-none">+</span>
            <span className="mt-1 leading-none">Add Subscription</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="bottom" 
          className="w-full max-w-2xl rounded-md mx-auto pt-2.5 h-[95vh] max-h-[95vh]"
        >
          <SheetHeader className=" sr-only">
            <SheetTitle>Add Subscription</SheetTitle>
            <SheetDescription>Open the add subscription sheet</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-full overflow-hidden">

            <div className="flex-grow overflow-y-auto p-6 pt-0">
              <CompanySearch onSelect={(c) => console.log(c)} />
            </div>

            <SheetFooter className="p-4 flex flex-row w-full justify-end border-t bg-background shrink-0">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button>Add Subscription</Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
