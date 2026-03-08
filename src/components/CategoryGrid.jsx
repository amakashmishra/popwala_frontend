import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowUpRight } from "lucide-react";
import catHouse from "@/assets/cat-house.jpg";
import catHall from "@/assets/cat-hall.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import catHotel from "@/assets/cat-hotel.jpg";
import catMall from "@/assets/cat-mall.jpg";
import catOffice from "@/assets/cat-office.jpg";

const CategoryGrid = () => {
  const { t } = useLanguage();

  const categories = [
    { name: t("cat.house"), key: "House", image: catHouse, count: 45 },
    { name: t("cat.hall"), key: "Hall", image: catHall, count: 32 },
    { name: t("cat.kitchen"), key: "Kitchen", image: catKitchen, count: 28 },
    { name: t("cat.bedroom"), key: "Bedroom", image: catBedroom, count: 56 },
    { name: t("cat.hotel"), key: "Hotel", image: catHotel, count: 18 },
    { name: t("cat.mall"), key: "Mall", image: catMall, count: 12 },
    { name: t("cat.office"), key: "Office", image: catOffice, count: 24 },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <div className="text-center mb-14">
          <span className="section-label">{t("cat.categories")}</span>
          <h2 className="section-title">{t("cat.title")}</h2>
          <p className="section-subtitle">{t("cat.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={`/gallery?category=${cat.key}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-all duration-300 group-hover:from-foreground/90" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-background font-display font-bold text-lg md:text-xl">{cat.name}</h3>
                      <p className="text-background/50 text-sm mt-0.5">{cat.count} {t("cat.designs")}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-background" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
