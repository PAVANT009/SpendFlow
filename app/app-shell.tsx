"use client";

import { NuqsAdapter } from "nuqs/adapters/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageSidebar } from "@/modules/page/ui/components/page-sidebar";
import { PageNavbar } from "@/modules/page/ui/components/page-navbar";
import { CurrencyProvider } from "@/currency-context";

export function AppShell({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CurrencyProvider>
          {!isAuthenticated ? (
            children
          ) : (
            <SidebarProvider>
              <PageSidebar />
              <main className="flex flex-col h-screen w-screen bg-muted">
                <PageNavbar />
                {children}
              </main>
            </SidebarProvider>
          )}
        </CurrencyProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
