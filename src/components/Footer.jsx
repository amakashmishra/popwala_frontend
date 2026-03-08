import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background/70 pb-20 md:pb-0">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <span className="font-display text-2xl font-bold text-background">
              Ceilo<span className="text-primary">Craft</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-background/50 max-w-xs">{t("footer.desc")}</p>
            <div className="mt-6 flex gap-3">
              {["Facebook", "Instagram", "YouTube"].map((s) => (
                <a key={s} href="#" className="w-10 h-10 rounded-full bg-background/8 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors text-xs font-bold">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold text-background mb-5 text-sm tracking-wide uppercase">{t("footer.quickLinks")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: t("nav.designs"), to: "/gallery" },
                { label: t("nav.bookVisit"), to: "/book-visit" },
                { label: t("footer.whyUs"), to: "/benefits" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-primary transition-colors flex items-center gap-1 group">
                  {l.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold text-background mb-5 text-sm tracking-wide uppercase">{t("footer.categories")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              <span>{t("cat.house")}</span>
              <span>{t("cat.bedroom")}</span>
              <span>{t("cat.kitchen")}</span>
              <span>{t("cat.office")}</span>
            </div>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-semibold text-background mb-5 text-sm tracking-wide uppercase">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                +91 98765 43210
              </a>
              <a href="mailto:hello@ceilocraft.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                hello@ceilocraft.com
              </a>
              <span className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Mumbai, India
              </span>
            </div>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-background/8 text-center text-sm text-background/30">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
