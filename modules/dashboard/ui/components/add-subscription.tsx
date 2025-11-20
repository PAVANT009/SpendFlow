// AddSubscription.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import CompanySearch from "./company-search";

export default function AddSubscription() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // handle click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex justify-end mb-9">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary rounded-md flex items-center gap-2 px-3 py-2 text-foreground"
      >
        <span className="text-2xl font-light leading-none">+</span>
        <span className="mt-1 leading-none">Add Subscription</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={popupRef}
            className="bg-card rounded-xl py-6 px-5 w-full max-w-2xl shadow-lg max-h-[95vh] mt-14 overflow-auto"
          >
            <CompanySearch onSelect={(c) => console.log(c)} />
            <div className="flex w-full justify-end gap-2">
              <button
                className="mt-4 px-4 py-2 bg-muted rounded"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>

              <button className="mt-4 px-4 py-2 bg-primary rounded">
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
