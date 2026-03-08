import { createContext, useCallback, useContext, useMemo, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("ceilocraft-lang");
    return saved || "en";
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("ceilocraft-lang", lang);
  };

  const t = useCallback((key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry["en"];
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      t,
    }),
    [language, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
