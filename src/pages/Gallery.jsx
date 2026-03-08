import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DesignCard from "@/components/DesignCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import catHouse from "@/assets/cat-house.jpg";
import catHall from "@/assets/cat-hall.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catHotel from "@/assets/cat-hotel.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catMall from "@/assets/cat-mall.jpg";

const allDesigns = [
  { id: "1", image: catHouse, title: "Modern Cove Ceiling", category: "House", style: "Modern", price: "₹45,000", rating: 4.8, type: "POP" },
  { id: "2", image: catHall, title: "Royal Gold Ceiling", category: "Hall", style: "Luxury", price: "₹1,20,000", rating: 4.9, type: "POP" },
  { id: "3", image: catBedroom, title: "Minimalist Tray Ceiling", category: "Bedroom", style: "Modern", price: "₹35,000", rating: 4.7, type: "POP" },
  { id: "4", image: catKitchen, title: "Elegant Oval Ceiling", category: "Kitchen", style: "Classic", price: "₹40,000", rating: 4.6, type: "POP" },
  { id: "5", image: catHotel, title: "Grand Floral Dome", category: "Hotel", style: "Luxury", price: "₹2,50,000", rating: 5.0, type: "POP" },
  { id: "6", image: catOffice, title: "Geometric Panel Ceiling", category: "Office", style: "Modern", price: "₹55,000", rating: 4.5, type: "POP" },
  { id: "7", image: catMall, title: "Wave Pattern Ceiling", category: "Mall", style: "Modern", price: "₹3,00,000", rating: 4.8, type: "POP" },
  { id: "8", image: catHouse, title: "Layered Drop Ceiling", category: "House", style: "Classic", price: "₹50,000", rating: 4.4, type: "POP" },
  { id: "9", image: catBedroom, title: "Backlit Panel Design", category: "Bedroom", style: "Luxury", price: "₹65,000", rating: 4.7, type: "POP" },
  // PVC Designs
  { id: "10", image: catKitchen, title: "PVC Waterproof Panel", category: "Kitchen", style: "Modern", price: "₹22,000", rating: 4.6, type: "PVC" },
  { id: "11", image: catOffice, title: "PVC Grid Ceiling", category: "Office", style: "Modern", price: "₹35,000", rating: 4.5, type: "PVC" },
  { id: "12", image: catBedroom, title: "PVC 3D Textured Panel", category: "Bedroom", style: "Luxury", price: "₹45,000", rating: 4.8, type: "PVC" },
  { id: "13", image: catHall, title: "PVC Glossy Finish", category: "Hall", style: "Modern", price: "₹38,000", rating: 4.7, type: "PVC" },
  { id: "14", image: catHouse, title: "PVC Wooden Finish", category: "House", style: "Classic", price: "₹30,000", rating: 4.4, type: "PVC" },
  { id: "15", image: catHotel, title: "PVC Premium Laminate", category: "Hotel", style: "Luxury", price: "₹1,80,000", rating: 4.9, type: "PVC" },
];

const categories = ["All", "House", "Hall", "Bedroom", "Kitchen", "Hotel", "Office", "Mall"];
const styles = ["All", "Modern", "Classic", "Luxury"];
const types = ["All", "POP", "PVC"];

const Gallery = () => {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const { t } = useLanguage();

  const filtered = allDesigns.filter(
    (d) =>
      (selectedCat === "All" || d.category === selectedCat) &&
      (selectedStyle === "All" || d.style === selectedStyle) &&
      (selectedType === "All" || d.type === selectedType)
  );

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold">{t("gallery.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("gallery.subtitle")}</p>

          <div className="mt-8 space-y-4">
            {/* Type filter */}
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">{t("gallery.type")}</span>
              <div className="flex flex-wrap gap-2">
                {types.map((tp) => (
                  <Button
                    key={tp}
                    size="sm"
                    variant={selectedType === tp ? "default" : "outline"}
                    onClick={() => setSelectedType(tp)}
                    className={selectedType === tp ? "gold-gradient border-0 text-primary-foreground" : ""}
                  >
                    {tp === "All" ? t("gallery.all") : tp}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">{t("gallery.category")}</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={selectedCat === c ? "default" : "outline"}
                    onClick={() => setSelectedCat(c)}
                    className={selectedCat === c ? "gold-gradient border-0 text-primary-foreground" : ""}
                  >
                    {c === "All" ? t("gallery.all") : c}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">{t("gallery.style")}</span>
              <div className="flex flex-wrap gap-2">
                {styles.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selectedStyle === s ? "default" : "outline"}
                    onClick={() => setSelectedStyle(s)}
                    className={selectedStyle === s ? "gold-gradient border-0 text-primary-foreground" : ""}
                  >
                    {s === "All" ? t("gallery.all") : s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <DesignCard key={d.id} {...d} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-20">{t("gallery.noResults")}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
