"use client";

import { Languages } from "lucide-react";
import { localeOptions, normalizeLocale } from "@/lib/i18n";
import { persistLanguage, useLanguage } from "./language-provider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, tr } = useLanguage();
  return (
    <label className={`language-switcher ${compact ? "is-compact" : ""}`}>
      <Languages size={16} aria-hidden="true" />
      {!compact && <span>{tr("Language")}</span>}
      <select
        aria-label={tr("Language")}
        value={locale}
        onChange={(event) => persistLanguage(normalizeLocale(event.target.value))}
      >
        {localeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {compact ? option.shortLabel : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
