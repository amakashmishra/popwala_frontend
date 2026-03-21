import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import { websiteApi } from "@/lib/api";

const fallbackCards = [{ title: "Services", count: 0, imageUrl: hero1 }];

const ServicesShowcase = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        const data = await websiteApi.getServices();
        if (!cancelled) {
          setServices(Array.isArray(data.services) ? data.services : []);
        }
      } catch (error) {
        if (!cancelled) {
          setServices([]);
        }
      }
    };

    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceCards = useMemo(() => (services.length > 0 ? services : fallbackCards), [services]);
  const shouldAutoScroll = sourceCards.length > 4;
  const marqueeCards = useMemo(
    () => (shouldAutoScroll ? [...sourceCards, ...sourceCards] : sourceCards),
    [shouldAutoScroll, sourceCards]
  );

  return (
    <section className="pt-8 pb-6 md:pt-10 md:pb-8">
      <div className="container">
        <div className="text-center">
          <span className="section-label text-[10px] md:text-xs">Services</span>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight md:text-4xl">Our Services</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Premium interior solutions for every need - from ceilings to complete home
            transformation
          </p>
        </div>

        <div className="services-marquee-wrap relative mt-6 w-full">
          <div className={`services-marquee-track ${shouldAutoScroll ? "" : "services-marquee-static"}`}>
            {marqueeCards.map((card, index) => (
              <motion.article
                key={`${card.id || card.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="services-marquee-item group relative overflow-hidden rounded-2xl shadow-[var(--shadow-md)]"
              >
                <img
                  src={card.imageUrl || hero1}
                  alt={card.name || card.title}
                  className="h-[135px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[150px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 md:bottom-3">
                  <h3 className="font-display text-xl font-semibold leading-tight text-white md:text-[1.75rem]">
                    {card.name || card.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-white/85 md:text-xs">{Number(card.designCount || card.count || 0)} designs</p>
                </div>
                <div className="absolute bottom-2.5 right-2.5 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <ArrowUpRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
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
