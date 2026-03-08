import DesignCard from "./DesignCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import catHouse from "@/assets/cat-house.jpg";
import catHall from "@/assets/cat-hall.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catHotel from "@/assets/cat-hotel.jpg";
import catOffice from "@/assets/cat-office.jpg";

const designs = [
  { id: "1", image: catHouse, title: "Modern Cove Ceiling", category: "Living Room", style: "Modern", price: "₹45,000", rating: 4.8, type: "POP" },
  { id: "2", image: catHall, title: "Royal Gold Ceiling", category: "Hall", style: "Luxury", price: "₹1,20,000", rating: 4.9, type: "POP" },
  { id: "3", image: catBedroom, title: "Minimalist Tray Ceiling", category: "Bedroom", style: "Modern", price: "₹35,000", rating: 4.7, type: "POP" },
  { id: "4", image: catKitchen, title: "PVC Elegant Panel", category: "Kitchen", style: "Modern", price: "₹28,000", rating: 4.6, type: "PVC" },
  { id: "5", image: catHotel, title: "Grand Floral Dome", category: "Hotel", style: "Luxury", price: "₹2,50,000", rating: 5.0, type: "POP" },
  { id: "6", image: catOffice, title: "PVC Grid Ceiling", category: "Office", style: "Modern", price: "₹42,000", rating: 4.5, type: "PVC" },
];

const FeaturedDesigns = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
        >
          <div>
            <span className="section-label">{t("featured.label")}</span>
            <h2 className="section-title">{t("featured.title")}</h2>
          </div>
          <Link to="/gallery">
            <Button variant="outline" className="gap-2 rounded-full px-6 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              {t("featured.viewAll")} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {designs.map((d) => (
            <DesignCard key={d.id} {...d} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
