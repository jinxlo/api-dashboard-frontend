"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { dictionaries, getDictionary, isLocale, type Locale, translate } from "@/lib/i18n";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const LOCALE_STORAGE_KEY = "ui-locale";
export const LOCALE_COOKIE = "ui-locale";

interface LocaleProviderProps {
  initialLocale: Locale;
  children: React.ReactNode;
}

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
      return;
    }
    document.documentElement.lang = initialLocale;
  }, [initialLocale]);

  const setLocale = useCallback(
    (value: Locale) => {
      setLocaleState((current) => {
        if (current === value) {
          return current;
        }
        return value;
      });
      document.documentElement.lang = value;
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
      } catch (error) {
        console.warn("Unable to persist locale in localStorage", error);
      }
      document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
      window.location.reload();
    },
    [],
  );

  const translateFn = useCallback(
    (key: string) => {
      const dictionary = getDictionary(locale);
      return translate(dictionary, key);
    },
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: translateFn,
    }),
    [locale, setLocale, translateFn],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function useTranslations() {
  const { t } = useLocale();
  return t;
}

export { dictionaries };

