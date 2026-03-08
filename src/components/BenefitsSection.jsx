import { motion } from "framer-motion";
import { Shield, Clock, Users, IndianRupee, Sparkles, Wrench, Palette, HeadphonesIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const BenefitsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    { icon: Sparkles, title: t("benefits.premium"), desc: t("benefits.premiumDesc") },
    { icon: Shield, title: t("benefits.warranty"), desc: t("benefits.warrantyDesc") },
    { icon: Users, title: t("benefits.experts"), desc: t("benefits.expertsDesc") },
    { icon: IndianRupee, title: t("benefits.pricing"), desc: t("benefits.pricingDesc") },
    { icon: Clock, title: t("benefits.onTime"), desc: t("benefits.onTimeDesc") },
    { icon: Palette, title: t("benefits.trending"), desc: t("benefits.trendingDesc") },
    { icon: Wrench, title: t("benefits.custom"), desc: t("benefits.customDesc") },
    { icon: HeadphonesIcon, title: t("benefits.support"), desc: t("benefits.supportDesc") },
  ];

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t("benefits.label")}</span>
          <h2 className="section-title">{t("benefits.title")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group text-center p-6 md:p-8 rounded-2xl border border-border/60 bg-card hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl gold-gradient flex items-center justify-center mb-5 shadow-[var(--shadow-gold)] group-hover:scale-110 transition-transform duration-300">
                <b.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-sm md:text-base">{b.title}</h3>
              <p className="mt-2 text-muted-foreground text-xs md:text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
