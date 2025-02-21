import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

interface LanguageState {
  language: "eng" | "arabic";
  setLanguage: (language: "eng" | "arabic") => void;
  getLanguage: () => "eng" | "arabic";
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language:
        (localStorage.getItem("language") as "eng" | "arabic") || "arabic", // Default to arabic
      setLanguage: (language) => {
        localStorage.setItem("language", language);
        set({ language });
      },
      getLanguage: () => {
        return (
          (localStorage.getItem("language") as "eng" | "arabic") ||
          get().language
        );
      },
    }),
    {
      name: "language-storage", // unique name
      storage: {
        getItem: (name: string) => {
          const storedValue = localStorage.getItem(name);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (name: string, value: StorageValue<LanguageState>) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);
