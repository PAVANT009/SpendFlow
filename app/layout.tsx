import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageSidebar } from "@/modules/page/ui/components/page-sidebar";
import { PageNavbar } from "@/modules/page/ui/components/page-navbar";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spend Flow - AI Budgeting Assistant",
  description: "Take control of your finances with Spend Flow, the AI-powered budgeting assistant that helps you track expenses, set budgets, and achieve your financial goals effortlessly.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("layout session", session);


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
      {!session?.user ? (
        children
      ) : (
        <SidebarProvider>
          <PageSidebar />
          <main className="flex flex-col flex-1 w-full bg-muted">
            <PageNavbar />
            {children}
          </main>
        </SidebarProvider>
      )}
    </Providers>
      </body>
    </html>
  );
}
