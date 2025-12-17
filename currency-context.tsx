"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { currencyOptions } from "@/data/currency-options";

type ExchangeRates = Record<string, number>;

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRate: number;
  convert: (amount: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState(currencyOptions[0].value);

  //rates have currencies with lowercase keys so you have to convert the caps to lower case while using it 
  const [rates, setRates] = useState<ExchangeRates>({});

  useEffect(() => {
    fetch("https://latest.currency-api.pages.dev/v1/currencies/inr.json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.inr) setRates(data.inr);
      })
      .catch(() => {});
  }, []);

  //convert exchange rate based on selected currency
  const exchangeRate =
    currency.toLocaleLowerCase() === "inr" ? 1 : rates[currency.toLocaleLowerCase()] ?? 1;

  const convert = (amount: number) => amount * exchangeRate;

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, exchangeRate, convert }}
    >
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
