// AddSubscription.tsx
"use client";

import { useRef, useState } from "react";
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
import { Subscription } from "@/types/Subscription";
import { useRouter } from "next/navigation";

export default function AddSubscription() {
  const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Subscription>();
    const [submitting, setSubmitting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

  const handleFormSubmit = async (formData: Subscription) => {
    console.log("Form data:", formData);  
    try {
      setSubmitting(true);
  
      const subscriptionData = {
        ...formData,
        logo_url: selected?.logo_url,
        url: selected?.url || formData.url,
      };
      
      console.log("Sending data:", subscriptionData);  
  
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });
  
      console.log("Response status:", res.status);  
      const responseData = await res.json();
      console.log("Response data:", responseData);
  
      if (!res.ok) {
        throw new Error(responseData.error || "Failed to create subscription");
      }
  
      setQuery("");
      setSelected(undefined);
      router.push("/subscriptions");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
      console.error("Error submitting subscription:", err);
      alert(`Error: ${err.message}`); 
      }
      else {
        console.log(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
              <CompanySearch handleSubmit={handleFormSubmit}  onSelect={(c) => console.log( "data coming from CompanySearch:" +  c)} />
            </div>

            <SheetFooter className="p-4 flex flex-row w-full justify-end border-t bg-background shrink-0">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              {/* <Button onClick={() =>handleFormSubmit} >Add Subscription</Button> */}
              <Button form="subscription-form" type="submit">
              Add Subscription
            </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
