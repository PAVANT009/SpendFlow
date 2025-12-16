"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { currencyOptions } from "@/data/currency-options";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(currencyOptions[0].value);

  useEffect(() => {
    fetch("/api/user/currency")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.currency) setCurrency(data.currency);
      })
      .catch(() => {});
  }, []);

  const changeCurrency = (newCurrency: string) => {
    if (newCurrency === currency) return;

    setCurrency(newCurrency);

    fetch("/api/user/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: newCurrency }),
    }).catch(() => {});
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return ctx;
}
