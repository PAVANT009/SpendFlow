// company-search.tsx
"use client";

import { Subscription } from "@/types/Subscription";
import { Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import MyForm from "./MyForm";

export default function CompanySearch({ onSelect }: { onSelect?: (c: Subscription) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Subscription[]>([]);
  const [selected, setSelected] = useState<Subscription>();
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);

      const res = await fetch(`/api/company-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      setSuggestions(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-4">
      
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-foreground font-semibold">Add New Subscription</p>
        <p className="text-muted-foreground text-sm">
          Add a new subscription to track your recurring payments
        </p>
      </div>

      <div>
        <hr className="w-full mx-auto text-foreground px-3" />

        <div className="my-3.5 flex flex-col gap-2">
          <div className="flex flex-row justify-start items-center gap-3">
            <Info size={17} className="text-muted-foreground" />
            <h1 className="text-md">Required information</h1>
            <p className="border border-input rounded-full text-[12px] font-extrabold px-2">
              Required
            </p>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search company..."
              className="
                focus:ring-2 focus:ring-primary
                outline-none w-full px-4 py-2 rounded-md
                border border-input 
                focus:border-primary
              "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {suggestions.length > 0 && (
              <div className="
                absolute left-0 right-0 top-full mt-2 border rounded-md 
                bg-card shadow text-card-foreground z-10 
                max-h-48 overflow-y-auto
              ">
                {suggestions.map((s)  => (
                  <div
                    key={s.url}
                    className="px-5 py-2.5 flex flex-row hover:bg-primary cursor-pointer hover:rounded-md"
                    onClick={() => {
                      setSelected(s);
                      setQuery(s.name);
                      setSuggestions([]);
                      if (onSelect) onSelect(s);
                    }}
                  >
                    <Image src={s.logo_url} alt="logo" width={20} height={20}/>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <MyForm />
      </div>

      {loading && query && (
        <div className="text-sm text-gray-500 mt-1">Searching...</div>
      )}

      {selected && (
        <div className="mt-4 text-center">
          <h3 className="font-semibold">{selected.name}</h3>
          <Image
            src={`https://img.logo.dev/${selected.url}?size=80&token=${process.env.NEXT_PUBLIC_LOGODEV_PUBLISHABLE_KEY}`}
            alt={selected.name}
            className="mx-auto mt-2"
            width={80}
            height={80}
          />
        </div>
      )}
    </div>
  );
}
