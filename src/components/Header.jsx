import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Globe, Home, LayoutGrid, CalendarCheck, Star, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { languageNames } from "@/i18n/translations";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("nav.home"), to: "/", icon: Home },
    { label: t("nav.designs"), to: "/gallery", icon: LayoutGrid },
    { label: t("nav.bookVisit"), to: "/book-visit", icon: CalendarCheck },
    { label: t("nav.benefits"), to: "/benefits", icon: Star },
    { label: t("nav.dashboard"), to: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-[var(--shadow-md)]" : "bg-transparent"}`}>
        <div className="container flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shadow-[var(--shadow-gold)]">
              <span className="text-primary-foreground font-display font-bold text-base">C</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Ceilo<span className="gold-text">Craft</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 bg-muted/60 backdrop-blur-sm rounded-full px-1.5 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-full"
                onClick={() => setLangOpen(!langOpen)}
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">{languageNames[language]}</span>
              </Button>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-[var(--shadow-lg)] py-1.5 min-w-[140px] z-50"
                >
                  {Object.keys(languageNames).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${language === lang ? "text-primary font-semibold" : "text-foreground"}`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            <Link to="/auth">
              <Button size="sm" className="gold-btn rounded-full gap-2 px-5">
                <User className="w-4 h-4" />
                {t("nav.login")}
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur-xl"
            >
              <div className="container py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                      location.pathname === link.to
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 py-3 flex gap-2">
                  {Object.keys(languageNames).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`text-xs px-3.5 py-2 rounded-full transition-colors font-medium ${language === lang ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="mt-2 w-full gold-btn rounded-xl gap-2">
                    <User className="w-4 h-4" />
                    {t("nav.login")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/40 safe-area-bottom">
        <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
