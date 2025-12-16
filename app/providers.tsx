// "use client";

// import { ReactNode } from "react";
// import { CurrencyProvider } from "@/currency-context";
// import { ThemeProvider } from "@/components/theme-provider";
// import { NuqsAdapter } from "nuqs/adapters/next";

// export function Providers({ children }: { children: ReactNode }) {
//   return (
//     <NuqsAdapter>
//       <ThemeProvider>
//         <CurrencyProvider>
//           {children}
//         </CurrencyProvider>
//       </ThemeProvider>
//     </NuqsAdapter>
//   );
// }

"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/currency-context";
import { NuqsAdapter } from "nuqs/adapters/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CurrencyProvider>{children}</CurrencyProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
