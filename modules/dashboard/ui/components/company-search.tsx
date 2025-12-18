"use client";

import { Subscription } from "@/types/Subscription";
import { Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import MyForm from "./my-form";

interface CompanySearchProps {
  handleSubmit?: (data: Subscription) => void | Promise<void>;
  onSelect?: (c: Subscription) => void;
}

export default function CompanySearch({ handleSubmit, onSelect }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Subscription[]>([]);
  const [selected, setSelected] = useState<Subscription>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const skipSearchRef = useRef(false);  

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false; 
      return;
    }

    const delay = setTimeout(async () => {
      if (!query) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/company-search?q=${encodeURIComponent(query)}`);
      const data: Subscription[] = await res.json();
      console.log(data);
      setSuggestions(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

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
    <div className="w-full flex flex-col gap-4">

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

          <div className="relative w-full" ref={containerRef}>
            <input
              type="text"
              placeholder="Search company..."
              className="
                focus:ring-2 focus:ring-primary text-sm
                outline-none w-full px-2 py-2 rounded-md
                border border-input 
                focus:border-primary
              "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {suggestions.length > 0 && (
              <div
                className="
                  absolute left-0 right-0 top-full mt-2 border rounded-md 
                  bg-card shadow text-card-foreground z-10 
                  max-h-48 overflow-y-auto
                "
              >
                {suggestions.map((s) => (
                  <div
                    key={s.domain}
                    className="px-5 py-2.5 flex flex-row gap-3 items-center hover:bg-primary cursor-pointer hover:rounded-md"
                    onClick={() => {
                      skipSearchRef.current = true; // block effect refresh
                      setSelected(s);
                      setQuery(s.name);
                      setSuggestions([]);
                      if (onSelect) onSelect(s);
                    }}
                  >
                    <Image src={s.logo_url} alt={s.name} width={20} height={20} />
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <MyForm
          onSubmit={handleSubmit}
          submitting={submitting}
          prefillValues={
            selected
              ? {
                  name: selected.name,
                  url: selected.domain,
                  category: selected.category,
                  logo_url: selected.logo_url,
                }
              : undefined
          }
        />
      </div>

      {loading && query && <div className="text-sm text-gray-500 mt-1">Searching...</div>}

      {selected && (
        <div className="mt-4 p-4 border border-input rounded-md">
          <h3 className="font-semibold text-center">{selected.name}</h3>
          <Image
            src={selected.logo_url}
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

// "use client";

// import { Subscription } from "@/types/Subscription";
// import { Info } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";
// import MyForm from "./my-form";

// interface CompanySearchProps {
//     handleSubmit?: (data: Subscription) => void | Promise<void>;
//     onSelect?: (c: Subscription) => void
// }

// export default function CompanySearch({handleSubmit, onSelect }:CompanySearchProps)  {
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState<Subscription[]>([]);
//   const [selected, setSelected] = useState<Subscription>();
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
  

//   useEffect(() => {
//   const delay = setTimeout(async () => {
//     if (!query) {
//       setSuggestions([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     const res = await fetch(`/api/company-search?q=${encodeURIComponent(query)}`);
//     const data = await res.json();
//     console.log(data);
//     setSuggestions(data);
//     setLoading(false);
//   }, 300);

//   return () => clearTimeout(delay);
// }, [query]);


//   // useEffect(() => {
//   //   if (!query) {
//   //     setSuggestions([]);
//   //     return;
//   //   }

//   //   const delay = setTimeout(async () => {
//   //     setLoading(true);

//   //     const res = await fetch(`/api/company-search?q=${encodeURIComponent(query)}`);
//   //     const data = await res.json();

//   //     setSuggestions(data);
//   //     setLoading(false);
//   //   }, 300);

//   //   return () => clearTimeout(delay);
//   // }, [query]);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//         setSuggestions([]);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);


//   return (
//     <div  className="w-full flex flex-col gap-4">
      
//       <div className="flex flex-col gap-2">
//         <p className="text-2xl text-foreground font-semibold">Add New Subscription</p>
//         <p className="text-muted-foreground text-sm">
//           Add a new subscription to track your recurring payments
//         </p>
//       </div>

//       <div>
//         <hr className="w-full mx-auto text-foreground px-3" />

//         <div className="my-3.5 flex flex-col gap-2">
//           <div className="flex flex-row justify-start items-center gap-3">
//             <Info size={17} className="text-muted-foreground" />
//             <h1 className="text-md">Required information</h1>
//             <p className="border border-input rounded-full text-[12px] font-extrabold px-2">
//               Required
//             </p>
//           </div>

//           <div className="relative w-full" ref={containerRef}>
//             <input
//               type="text"
//               placeholder="Search company..."
//               className="
//                 focus:ring-2 focus:ring-primary text-sm
//                 outline-none w-full px-2 py-2 rounded-md
//                 border border-input 
//                 focus:border-primary
//               "
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />

//             {suggestions.length > 0 && (
//               <div className="
//                 absolute left-0 right-0 top-full mt-2 border rounded-md 
//                 bg-card shadow text-card-foreground z-10 
//                 max-h-48 overflow-y-auto
//               ">
//                 {suggestions.map((s)  => (
//                   <div
//                     key={s.id}
//                     className="px-5 py-2.5 flex flex-row gap-3 items-center hover:bg-primary cursor-pointer hover:rounded-md"
//                     onClick={() => {
//                       setSelected(s);
//                       setQuery(s.name);
//                       setSuggestions([]);
//                       if (onSelect) onSelect(s);
//                     }}
//                   >
//                     <Image src={s.logo_url} alt="logo" width={20} height={20}/>
//                     <div className="font-medium">{s.name}</div>
//                     <div className="text-sm text-gray-500">{s.url}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <MyForm 
//           onSubmit={handleSubmit}
//           submitting={submitting}
//           prefillValues={
//             selected
//               ? {
//                   name: selected.name,
//                   url: selected.domain,
//                   category: selected.category,
//                   logo_url: selected.logo_url
//                 }
//               : undefined
//           }
//         />
//       </div>

//       {loading && query && (
//         <div className="text-sm text-gray-500 mt-1">Searching...</div>
//       )}

//       {selected && (
//         <div className="mt-4 p-4 border border-input rounded-md">
//           <h3 className="font-semibold text-center">{selected.name}</h3>
//           <Image
//             src={selected.logo_url}
//             alt={selected.name}
//             className="mx-auto mt-2"
//             width={80}
//             height={80}
//           />
//         </div>
//       )}
//     </div>
//   );
// }