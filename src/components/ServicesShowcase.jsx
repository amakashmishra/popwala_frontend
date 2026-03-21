import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import catHall from "@/assets/cat-hall.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import hero1 from "@/assets/hero-1.jpg";
import catHouse from "@/assets/cat-house.jpg";
import hero2 from "@/assets/hero-2.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import hero3 from "@/assets/hero-3.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catHotel from "@/assets/cat-hotel.jpg";

const serviceCards = [
  { title: "POP Ceiling", count: "120 designs", image: catHall },
  { title: "PVC Ceiling", count: "85 designs", image: catBedroom },
  { title: "Electrical", count: "64 designs", image: hero1 },
  { title: "Furniture", count: "95 designs", image: catHouse },
  { title: "Painting", count: "78 designs", image: hero2 },
  { title: "Home Decor", count: "56 designs", image: catKitchen },
  { title: "Doors & Windows", count: "42 designs", image: hero3 },
  { title: "Glass Work", count: "38 designs", image: catOffice },
  { title: "Plumbing", count: "30 designs", image: catHotel },
];
const marqueeCards = [...serviceCards, ...serviceCards];

const ServicesShowcase = () => {
  return (
    <section className="section-padding pt-14 md:pt-16">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Services</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Premium interior solutions for every need - from ceilings to complete home
            transformation
          </p>
        </div>

        <div className="services-marquee-wrap relative left-1/2 mt-12 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-8">
          <div className="services-marquee-track">
            {marqueeCards.map((card, index) => (
              <motion.article
                key={`${card.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -5, scale: 1.015 }}
                className="services-marquee-item group relative overflow-hidden rounded-2xl shadow-[var(--shadow-md)]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-3xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{card.count}</p>
                </div>
                <div className="absolute bottom-4 right-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
