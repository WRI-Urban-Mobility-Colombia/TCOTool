import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type { SelectContextType } from '../Select.d';

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export function SelectProvider({ children, value }: { children: ReactNode; value: SelectContextType }) {
  return <SelectContext.Provider value={value}>{children}</SelectContext.Provider>;
}

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (context === undefined) {
    throw new Error('useSelectContext must be used within a SelectProvider');
  }

  return context;
}
