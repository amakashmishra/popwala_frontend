import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BenefitsSection from "@/components/BenefitsSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const Benefits = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header hideNavLinks />
      <div className="pt-24">
        <div className="container text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">{t("benefitsPage.label")}</span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">{t("benefitsPage.title")}</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">{t("benefitsPage.desc")}</p>
          </motion.div>
        </div>
        <BenefitsSection />
        <div className="text-center pb-20">
          <Link to="/book-visit">
            <Button size="lg" className="gold-gradient border-0 text-primary-foreground font-semibold px-10">
              {t("benefitsPage.cta")}
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Benefits;
