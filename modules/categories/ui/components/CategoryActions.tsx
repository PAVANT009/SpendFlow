"use client"

import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { MoreVertical, PenSquare, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Budget } from "@/types/Budget"

export function CategoryActions({categoryData} : {categoryData:Budget}) {

    const [budget,setBudget] = useState(categoryData.maxBudget);
    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/budget", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        category: categoryData.category,
        maxBudget: Number(budget),
        }),
    });

    const data = await res.json();

    if (res.ok) {
        console.log(data.message);
        setOpen(false);            
    } else {
        console.log(data.error);
    }
    }

  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-md hover:bg-muted">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-32">
          <DropdownMenuItem onClick={() => setOpen(true)}>
             <PenSquare/> Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => console.log("Delete")} className="text-red-600">
             <Trash className="text-red-600"/> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
                  side="top" 
                  className="w-[30%] max-w-[30%] border-1 border-border bg-card  rounded-2xl mx-auto pt-1  h-[50vh] max-h-[50vh] mt-24"
                >
                  <SheetHeader >
                    <SheetTitle className="text-2xl text-foreground">Edit Subscription</SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">Organize your subscriptions and set budget limits for each category</SheetDescription>

                  </SheetHeader>
        
                  <div className="flex flex-col h-full px-2.5 overflow-hidden justify-center align-middle">
        
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Category*</label>
                        <input type="text" value={categoryData.category}  disabled   className="border block py-1 border-input rounded opacity-60 cursor-not-allowed pl-1.5"
/>
                        <label className="font-semibold">Budget</label>
                        <input type="number" value={budget} onChange={(e) =>setBudget(Number(e.target.value)) } onWheel={(e) => e.currentTarget.blur()} className="border border-input py-1 rounded pl-1.5" />
                    </div>
        
                    <SheetFooter className="p-4 flex flex-row w-full justify-end   ">
                      <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </SheetClose>
                      <Button onClick={handleSubmit} >Submit</Button>
                      {/* <Button form="subscription-form" type="submit">
                      Add Subscription
                    </Button> */}
                    </SheetFooter>
                  </div>
                </SheetContent>
      </Sheet>
    </>
  )
}
