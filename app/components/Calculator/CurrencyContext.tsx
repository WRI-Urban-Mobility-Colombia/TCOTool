'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Currency } from './CalculatorForm.constants';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  getCurrencyPrefix: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(Currency.dolars);

  const getCurrencyPrefix = () => {
    return currency === Currency.colombianPesos ? 'COP' : '$';
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, getCurrencyPrefix }}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
