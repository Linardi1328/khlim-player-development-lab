"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  LOCALE_COOKIE,
  shouldTranslateElement,
  tr,
  translateUi,
  type Locale,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  tr: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  tr: (value) => value,
});

function TranslationBridge({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale === "en") return;

    const translateNode = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent) return;
      if (!shouldTranslateElement(node.parentElement)) return;
      const next = translateUi(locale, node.textContent);
      if (next !== node.textContent) node.textContent = next;
    };

    const translateAttributes = (element: Element) => {
      if (!shouldTranslateElement(element)) return;
      for (const attribute of ["placeholder", "title", "aria-label"]) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const next = translateUi(locale, value);
        if (next !== value) element.setAttribute(attribute, next);
      }
    };

    const translateTree = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        translateNode(root);
        return;
      }
      if (root instanceof Element) {
        translateAttributes(root);
        root.querySelectorAll("*").forEach(translateAttributes);
      }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        translateNode(current);
        current = walker.nextNode();
      }
    };

    translateTree(document.body);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(translateTree);
        if (mutation.type === "characterData") translateNode(mutation.target);
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [locale]);
  return null;
}

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<LanguageContextValue>(
    () => ({ locale: initialLocale, tr: (text) => tr(initialLocale, text) }),
    [initialLocale],
  );
  return (
    <LanguageContext.Provider value={value}>
      <TranslationBridge locale={initialLocale} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function persistLanguage(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.location.reload();
}
