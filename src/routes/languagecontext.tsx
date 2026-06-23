import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "el" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isEl: boolean; // Helper boolean to make our components cleaner
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Defaulting to Greek ("el")
  const [language, setLanguage] = useState<Language>("el");

  // Optional: Remember the user's choice if they refresh the page
  useEffect(() => {
    const saved = localStorage.getItem("margarita-lang") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "el" ? "en" : "el";
      localStorage.setItem("margarita-lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isEl: language === "el" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}