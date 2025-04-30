import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
  value?: {
    light?: string;
    dark?: string;
    system?: string;
  };
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
  value,
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = true,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      value={value}
      storageKey={storageKey}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme={enableColorScheme}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
