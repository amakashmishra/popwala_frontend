import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Star, Calendar, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import catHouse from "@/assets/cat-house.jpg";
import catHall from "@/assets/cat-hall.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";

const mockDesigns = {
  "1": { image: catHouse, title: "Modern Cove Ceiling", category: "Living Room", style: "Modern", price: "₹45,000", rating: 4.8, type: "POP", desc: "A sleek, modern cove ceiling design with recessed LED lighting that creates a warm ambient glow. Perfect for contemporary living rooms." },
  "2": { image: catHall, title: "Royal Gold Ceiling", category: "Hall", style: "Luxury", price: "₹1,20,000", rating: 4.9, type: "POP", desc: "Ornate POP ceiling with intricate gold accents and a stunning central chandelier mount. Ideal for grand halls and event spaces." },
  "3": { image: catBedroom, title: "Minimalist Tray Ceiling", category: "Bedroom", style: "Modern", price: "₹35,000", rating: 4.7, type: "POP", desc: "Clean tray ceiling with warm cove lighting that adds depth and elegance to any bedroom." },
  "4": { image: catKitchen, title: "PVC Waterproof Panel", category: "Kitchen", style: "Modern", price: "₹22,000", rating: 4.6, type: "PVC", desc: "Waterproof PVC ceiling panel perfect for kitchens and bathrooms. Easy to clean, moisture resistant, and long-lasting." },
  "10": { image: catKitchen, title: "PVC Waterproof Panel", category: "Kitchen", style: "Modern", price: "₹22,000", rating: 4.6, type: "PVC", desc: "Waterproof PVC ceiling panel perfect for kitchens and bathrooms. Easy to clean, moisture resistant, and long-lasting." },
  "11": { image: catHouse, title: "PVC Grid Ceiling", category: "Office", style: "Modern", price: "₹35,000", rating: 4.5, type: "PVC", desc: "Lightweight PVC grid ceiling ideal for offices. Quick installation, low maintenance, and excellent durability." },
  "12": { image: catBedroom, title: "PVC 3D Textured Panel", category: "Bedroom", style: "Luxury", price: "₹45,000", rating: 4.8, type: "PVC", desc: "Premium 3D textured PVC panels that add depth and luxury to bedrooms. Available in multiple patterns and finishes." },
};

const DesignDetail = () => {
  const { id } = useParams();
  const design = mockDesigns[id || "1"] || mockDesigns["1"];
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header hideNavLinks />
      <div className="pt-20 pb-20">
        <div className="container max-w-5xl">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> {t("detail.back")}
          </Link>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={design.image} alt={design.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-sm font-semibold">{design.style}</span>
                <Badge variant="outline" className="text-xs">{design.type}</Badge>
              </div>
              <h1 className="font-display text-3xl font-bold mt-1">{design.title}</h1>
              <p className="text-muted-foreground text-sm mt-1">{design.category}</p>
              <div className="flex items-center gap-2 mt-3">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-medium">{design.rating}</span>
                <span className="text-muted-foreground text-sm">(48 {t("detail.reviews")})</span>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">{design.desc}</p>
              <div className="mt-6 p-4 bg-secondary rounded-xl">
                <span className="text-sm text-muted-foreground">{t("detail.startingFrom")}</span>
                <p className="font-display text-2xl font-bold text-primary">{design.price}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <Link to="/book-visit" className="flex-1">
                  <Button className="w-full gold-gradient border-0 text-primary-foreground font-semibold gap-2 h-11">
                    <Calendar className="w-4 h-4" /> {t("detail.bookVisit")}
                  </Button>
                </Link>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DesignDetail;
