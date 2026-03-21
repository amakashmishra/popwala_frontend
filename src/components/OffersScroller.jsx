import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
const offers = [
  {
    id: "quick-booking",
    title: "Get experts in 2 hours",
    subtitle: "Electricians, plumbers, carpenters",
    cta: "Book now",
    badge: "Fast service",
    image: hero1,
    tone: "bg-[#1f7ea7]",
  },
  {
    id: "premium-pop",
    title: "Premium POP designs",
    subtitle: "Elegant ceilings for modern homes",
    cta: "Explore",
    badge: "Top picks",
    image: hero2,
    tone: "bg-[#a97b33]",
  },
  {
    id: "visit-offer",
    title: "Free site visit on first booking",
    subtitle: "Get on-site consultation at no cost",
    cta: "Claim now",
    badge: "Limited offer",
    image: hero3,
    tone: "bg-[#1f7a61]",
  },
  {
    id: "repair-package",
    title: "Deep clean & repair packages",
    subtitle: "AC, plumbing, fixtures and more",
    cta: "View plans",
    badge: "Save more",
    image: hero1,
    tone: "bg-[#2f2f35]",
  },
];

export default function OffersScroller() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  const scrollByCards = (direction) => {
    if (!trackRef.current) return;
    const distance = Math.round(trackRef.current.clientWidth * 0.9) * direction;
    trackRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  return (
    <section className="pt-2 pb-8 md:pb-10">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="section-label text-[10px] md:text-xs">Offers</p>
            <h3 className="mt-1 font-display text-2xl font-semibold md:text-3xl">Popular Deals</h3>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => scrollByCards(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => scrollByCards(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={trackRef}
            onScroll={updateScrollState}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="group relative min-w-[280px] flex-1 snap-start overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-sm)] md:min-w-[420px]"
              >
                <div className="grid grid-cols-[1.1fr_0.9fr]">
                  <div className={`p-5 text-white ${offer.tone}`}>
                    <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                      {offer.badge}
                    </span>
                    <h4 className="mt-3 text-2xl font-semibold leading-tight">{offer.title}</h4>
                    <p className="mt-2 text-sm text-white/85">{offer.subtitle}</p>
                    <button className="mt-4 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30">
                      {offer.cta}
                    </button>
                  </div>
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </article>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/95 text-foreground shadow-md md:inline-flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 z-10 hidden h-14 w-14 translate-x-1/2 -translate-y-1/2 rounded-full bg-background/95 text-foreground shadow-md md:inline-flex"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
