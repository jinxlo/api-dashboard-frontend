import "server-only";

import { cookies } from "next/headers";

import { getDictionary, isLocale, type Locale } from "../i18n";

const LOCALE_COOKIE = "ui-locale";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(stored)) {
    return stored;
  }
  return "es";
}

export async function getServerDictionary(locale?: Locale) {
  const resolvedLocale = locale ?? (await getServerLocale());
  return getDictionary(resolvedLocale);
}

