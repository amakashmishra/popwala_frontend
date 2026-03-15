import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { websiteApi } from "@/lib/api";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    const fetchBanners = async () => {
      try {
        const data = await websiteApi.getHomepageBanners();
        const mapped = (data.banners || []).map((banner) => ({
          image: banner.imageUrl,
          title: banner.title?.[language] || banner.title?.en || "",
          subtitle: banner.description?.[language] || banner.description?.en || "",
          cta: t("hero.cta.bookVisit"),
          link: "/book-visit",
        }));
        if (!cancelled) {
          setSlides(mapped);
          setCurrent(0);
        }
      } catch (error) {
        if (!cancelled) {
          setSlides([]);
        }
      }
    };

    fetchBanners();
    return () => {
      cancelled = true;
    };
  }, [t, language]);

  useEffect(() => {
    if (slides.length === 0) return undefined;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No active banners available.</p>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end pb-28 md:pb-36">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="h-1 bg-primary rounded-full mb-6"
              />
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-background leading-[1.1] tracking-tight">
                {slide.title}
              </h1>
              <p className="mt-5 text-base md:text-lg text-background/70 font-light leading-relaxed max-w-lg">
                {slide.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={slide.link}>
                  <Button size="lg" className="gold-btn px-8 rounded-full text-base h-12">
                    {slide.cta}
                  </Button>
                </Link>
                <Link to="/book-visit">
                  <Button size="lg" variant="outline" className="border-background/20 text-background hover:bg-background/10 rounded-full h-12 px-8 backdrop-blur-sm">
                    {t("hero.cta.bookVisit")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? 40 : 8 }}
          >
            <div className="absolute inset-0 bg-background/30 rounded-full" />
            {i === current && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-0 bg-primary rounded-full origin-left"
              />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-background hover:bg-background/20 transition-all duration-200 border border-background/10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-background hover:bg-background/20 transition-all duration-200 border border-background/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroBanner;
