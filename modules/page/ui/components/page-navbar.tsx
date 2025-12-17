"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon, PanelRightIcon, SearchIcon } from "lucide-react";
import { ModeToggleBtn } from "@/components/theme-button";
import { CurrencySelect } from "@/modules/dashboard/ui/components/currency-select";

export const PageNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <nav className="flex px-4 items-center py-3 border-b bg-background w-full justify-between">  <Button className="size-9" variant="outline" onClick={toggleSidebar}>
        {state === "collapsed" || isMobile ? (
          <PanelLeftIcon className="size-4" />
        ) : (
          <PanelRightIcon className="size-4" />
        )}
      </Button>

      <Button
        className="h-9 font-normal w-[240px] text-muted-foreground"
        variant="outline"
        size="sm"
        onClick={() => setCommandOpen((open) => !open)}
      >
        <SearchIcon />
        Search
        <kbd className="ml-auto inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px]">
          ⌘k
        </kbd>
      </Button>

      <div className="flex flex-row justify-end gap-x-2">
        <CurrencySelect />
        <ModeToggleBtn />
      </div>
    </nav>
  );
};
