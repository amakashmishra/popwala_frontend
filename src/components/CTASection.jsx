import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-12 rounded-3xl gold-gradient text-primary-foreground overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-background/15 backdrop-blur-sm flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">{t("cta.schedule.title")}</h3>
              <p className="mt-3 opacity-80 text-sm md:text-base leading-relaxed max-w-sm">{t("cta.schedule.desc")}</p>
              <Link to="/book-visit">
                <Button size="lg" variant="secondary" className="mt-8 font-semibold rounded-full px-8 gap-2 group-hover:gap-3 transition-all">
                  {t("cta.schedule.btn")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-12 rounded-3xl bg-foreground text-background overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-background/10 backdrop-blur-sm flex items-center justify-center mb-6">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">{t("cta.upload.title")}</h3>
              <p className="mt-3 opacity-60 text-sm md:text-base leading-relaxed max-w-sm">{t("cta.upload.desc")}</p>
              <Link to="/upload">
                <Button size="lg" className="mt-8 gold-btn rounded-full px-8 gap-2 group-hover:gap-3 transition-all">
                  {t("cta.upload.btn")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
