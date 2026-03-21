import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Star,
  ShieldCheck,
  Users,
  Sparkles,
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  Square,
  Wrench,
  Building2,
  Timer,
  BadgeDollarSign,
  BadgeCheck,
  Headphones,
  MapPin,
  ClipboardList,
  CalendarDays,
  UserCheck,
  CreditCard,
  Smartphone,
  Play,
  Store,
  Gift,
  ArrowRight,
  Percent,
  Flame,
} from "lucide-react";
import heroServices from "@/assets/hero-services-BNVyKqDj.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const highlights = [
  { icon: Star, textKey: "landing.highlights.rating" },
  { icon: Users, textKey: "landing.highlights.customers" },
  { icon: ShieldCheck, textKey: "landing.highlights.verified" },
  { icon: Sparkles, textKey: "landing.highlights.sameDay" },
];

const services = [
  { icon: Zap, titleKey: "landing.services.electrical" },
  { icon: Droplets, titleKey: "landing.services.plumbing" },
  { icon: Paintbrush, titleKey: "landing.services.painting" },
  { icon: Hammer, titleKey: "landing.services.furniture" },
  { icon: Square, titleKey: "landing.services.glass" },
  { icon: Sparkles, titleKey: "landing.services.cleaning" },
  { icon: Wrench, titleKey: "landing.services.repair" },
  { icon: Building2, titleKey: "landing.services.renovation" },
];

const whyChoose = [
  {
    icon: ShieldCheck,
    titleKey: "landing.why.verified.title",
    descriptionKey: "landing.why.verified.desc",
  },
  {
    icon: Timer,
    titleKey: "landing.why.quick.title",
    descriptionKey: "landing.why.quick.desc",
  },
  {
    icon: BadgeDollarSign,
    titleKey: "landing.why.pricing.title",
    descriptionKey: "landing.why.pricing.desc",
  },
  {
    icon: BadgeCheck,
    titleKey: "landing.why.warranty.title",
    descriptionKey: "landing.why.warranty.desc",
  },
  {
    icon: Headphones,
    titleKey: "landing.why.support.title",
    descriptionKey: "landing.why.support.desc",
  },
  {
    icon: MapPin,
    titleKey: "landing.why.location.title",
    descriptionKey: "landing.why.location.desc",
  },
];

const howItWorks = [
  {
    icon: ClipboardList,
    titleKey: "landing.how.select.title",
    descriptionKey: "landing.how.select.desc",
  },
  {
    icon: CalendarDays,
    titleKey: "landing.how.book.title",
    descriptionKey: "landing.how.book.desc",
  },
  {
    icon: UserCheck,
    titleKey: "landing.how.visit.title",
    descriptionKey: "landing.how.visit.desc",
  },
  {
    icon: CreditCard,
    titleKey: "landing.how.pay.title",
    descriptionKey: "landing.how.pay.desc",
  },
];

const customerReviews = [
  {
    name: "Rahul Sharma",
    initial: "R",
    quoteKey: "landing.reviews.r1",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    initial: "P",
    quoteKey: "landing.reviews.r2",
    rating: 5,
  },
  {
    name: "Ankit Verma",
    initial: "A",
    quoteKey: "landing.reviews.r3",
    rating: 4,
  },
  {
    name: "Sneha Kapoor",
    initial: "S",
    quoteKey: "landing.reviews.r4",
    rating: 5,
  },
];

const liveOffers = [
  "landing.offers.o1",
  "landing.offers.o2",
  "landing.offers.o3",
];
const liveOffersTicker = [...liveOffers, ...liveOffers];

const quickServiceCards = [
  {
    icon: Zap,
    titleKey: "landing.quick.electrical.title",
    tag: "POPULAR",
    descriptionKey: "landing.quick.electrical.desc",
  },
  {
    icon: Droplets,
    titleKey: "landing.quick.plumbing.title",
    tag: "TOP RATED",
    descriptionKey: "landing.quick.plumbing.desc",
  },
  {
    icon: Paintbrush,
    titleKey: "landing.quick.painting.title",
    tag: "TRENDING",
    descriptionKey: "landing.quick.painting.desc",
  },
];

const availableCities = [
  "landing.city.nagpur",
  "landing.city.chandrapur",
  "landing.city.amravati",
  "landing.city.wardha",
];

const LandingPage = () => {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const baseEase = [0.22, 1, 0.36, 1];
  const heroLift = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: baseEase },
      };

  const heroLiftDelayed = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.75, ease: baseEase, delay: 0.15 },
      };

  const sectionContainer = prefersReducedMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.15 },
        variants: {
          hidden: { opacity: 0, y: 36 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.65,
              ease: baseEase,
              staggerChildren: 0.08,
              delayChildren: 0.05,
            },
          },
        },
      };

  const itemReveal = prefersReducedMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: baseEase } },
        },
      };

  const hoverLift = prefersReducedMotion ? {} : { whileHover: { y: -6, scale: 1.01 } };
  const hoverZoomImage = prefersReducedMotion ? {} : { whileHover: { scale: 1.03 } };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header hideNavLinks />
      <div
        className="min-h-screen pt-24 md:pt-28"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.35) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.35) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div className="container py-6 md:py-8">
          <main className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <motion.section className="space-y-6 lg:pr-8" {...heroLift}>
              <motion.h1
                className="text-balance font-display text-5xl font-bold leading-[0.95] text-foreground md:text-6xl xl:text-7xl"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.005 }}
              >
                {t("landing.hero.titleLine1")}
                <span className="gold-text block pt-2">{t("landing.hero.titleLine2")}</span>
              </motion.h1>

              <motion.p
                className="max-w-2xl text-xl leading-relaxed text-muted-foreground"
                {...(prefersReducedMotion
                  ? {}
                  : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.08 } })}
              >
                {t("landing.hero.subtitle")}
              </motion.p>

              <motion.div
                className="flex max-w-2xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-md)]"
                {...(prefersReducedMotion
                  ? {}
                  : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.14 } })}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  placeholder={t("landing.hero.searchPlaceholder")}
                  type="text"
                />
                <motion.button
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  {t("landing.hero.searchBtn")}
                </motion.button>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                {...(prefersReducedMotion
                  ? {}
                  : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.2 } })}
              >
                <Link to="/book-visit">
                  <motion.button
                    className="rounded-xl bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition hover:translate-y-[-1px] hover:bg-primary/90"
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  >
                    {t("landing.hero.bookNow")}
                  </motion.button>
                </Link>
                <Link to="/gallery">
                  <motion.button
                    className="rounded-xl border border-border bg-card px-7 py-3 text-base font-semibold transition hover:bg-muted"
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  >
                    {t("landing.hero.explore")}
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-x-6 gap-y-3 pt-1"
                {...(prefersReducedMotion
                  ? {}
                  : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.26 } })}
              >
                {highlights.map((item) => (
                  <motion.div
                    key={item.textKey}
                    className="flex items-center gap-2 text-lg text-muted-foreground"
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span>{t(item.textKey)}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            <motion.section className="overflow-hidden rounded-[28px] shadow-[var(--shadow-lg)]" {...heroLiftDelayed}>
              <motion.div className="overflow-hidden rounded-[28px]" {...hoverZoomImage}>
                <motion.img
                  src={heroServices}
                  alt="Home service professionals"
                  className="h-full w-full object-cover"
                  transition={{ duration: 0.55, ease: baseEase }}
                />
              </motion.div>
            </motion.section>
          </main>

          <motion.section className="mt-20 pb-10 md:mt-24" {...sectionContainer}>
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2 className="font-display text-4xl font-bold text-foreground md:text-5xl" {...itemReveal}>
                {t("landing.services.title")}
              </motion.h2>
              <motion.p className="mt-3 text-lg text-muted-foreground" {...itemReveal}>
                {t("landing.services.subtitle")}
              </motion.p>
            </div>

            <motion.div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" {...itemReveal}>
              {services.map((service) => (
                <motion.div
                  key={service.titleKey}
                  className="group rounded-3xl border border-border/80 bg-card/70 p-6 shadow-[var(--shadow-sm)] backdrop-blur-sm transition hover:border-primary/40 hover:shadow-[var(--shadow-md)]"
                  {...hoverLift}
                  transition={{ duration: 0.35, ease: baseEase }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-8 font-semibold text-foreground">{t(service.titleKey)}</h3>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="mt-10 flex justify-center" {...itemReveal}>
              <Link to="/gallery">
                <motion.button
                  className="rounded-xl border border-border bg-card px-7 py-3 text-base font-semibold transition hover:bg-muted"
                  whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  {t("landing.services.viewAll")}
                </motion.button>
              </Link>
            </motion.div>
          </motion.section>

          <motion.section className="pt-12 pb-16 md:pt-16 md:pb-20" {...sectionContainer}>
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2 className="font-display text-4xl font-bold text-foreground md:text-5xl" {...itemReveal}>
                {t("landing.why.title")}
              </motion.h2>
              <motion.p className="mt-3 text-lg text-muted-foreground" {...itemReveal}>
                {t("landing.why.subtitle")}
              </motion.p>
            </div>

            <motion.div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" {...itemReveal}>
              {whyChoose.map((item) => (
                <motion.div
                  key={item.titleKey}
                  className="rounded-3xl border border-border/80 bg-card p-6 shadow-[var(--shadow-sm)]"
                  {...hoverLift}
                  transition={{ duration: 0.35, ease: baseEase }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight text-foreground">{t(item.titleKey)}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{t(item.descriptionKey)}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="rounded-3xl bg-muted/40 px-6 py-14 md:px-10 md:py-20" {...sectionContainer}>
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2 className="font-display text-4xl font-bold text-foreground md:text-5xl" {...itemReveal}>
                {t("landing.how.title")}
              </motion.h2>
              <motion.p className="mt-3 text-lg text-muted-foreground" {...itemReveal}>
                {t("landing.how.subtitle")}
              </motion.p>
            </div>

            <motion.div className="mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-2 xl:grid-cols-4" {...itemReveal}>
              {howItWorks.map((step, index) => (
                <motion.div key={step.titleKey} className="text-center" {...hoverLift} transition={{ duration: 0.3, ease: baseEase }}>
                  <div className="mx-auto flex w-fit items-start">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="-ml-2 -mt-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-foreground">{t(step.titleKey)}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{t(step.descriptionKey)}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="mt-10 rounded-3xl bg-muted/40 px-6 py-14 md:px-10 md:py-20" {...sectionContainer}>
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
              <motion.div className="flex justify-center" {...itemReveal}>
                <motion.div
                  className="relative rounded-[44px] border-[10px] border-foreground bg-card p-4 shadow-[var(--shadow-lg)]"
                  {...hoverLift}
                  transition={{ duration: 0.35, ease: baseEase }}
                >
                  <div className="absolute left-1/2 top-3 h-1.5 w-20 -translate-x-1/2 rounded-full bg-foreground/75" />
                  <div className="w-[248px] overflow-hidden rounded-[30px] bg-background">
                    <div className="bg-gradient-to-b from-primary/20 via-primary/5 to-background px-5 pb-5 pt-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                        <Smartphone className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mt-4 text-center text-5xl font-semibold text-foreground">Popwala</h3>
                      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
                  {t("landing.app.desc")}
                </p>
                    </div>

                    <div className="space-y-3 px-4 py-4">
                      <div className="rounded-xl border border-border bg-card p-3">
                        <div className="h-2 w-20 rounded bg-muted" />
                        <div className="mt-2 h-2 w-full rounded bg-muted" />
                        <div className="mt-2 h-2 w-4/5 rounded bg-muted" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["landing.app.tag1", "landing.app.tag2", "landing.app.tag3", "landing.app.tag4"].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-border bg-muted/70 px-3 py-2 text-center text-xs font-medium text-foreground"
                          >
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                      <div className="rounded-xl border border-border bg-card px-3 py-2 text-center text-xs font-semibold text-primary">
                        {t("landing.app.confirmed")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div className="max-w-xl" {...itemReveal}>
                <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  {t("landing.app.title")}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t("landing.app.subtitle")}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <motion.button
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {t("landing.app.googlePlay")}
                  </motion.button>
                  <motion.button
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  >
                    <Store className="h-4 w-4" />
                    {t("landing.app.appStore")}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section className="mt-10 rounded-3xl bg-muted/40 px-6 py-14 md:px-10 md:py-20" {...sectionContainer}>
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2 className="font-display text-4xl font-bold text-foreground md:text-5xl" {...itemReveal}>
                {t("landing.reviews.title")}
              </motion.h2>
              <motion.p className="mt-3 text-lg text-muted-foreground" {...itemReveal}>
                {t("landing.reviews.subtitle")}
              </motion.p>
            </div>

            <motion.div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4" {...itemReveal}>
              {customerReviews.map((review) => (
                <motion.div
                  key={review.name}
                  className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-sm)]"
                  {...hoverLift}
                  transition={{ duration: 0.35, ease: baseEase }}
                >
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${review.name}-star-${index}`}
                        className={`h-4 w-4 ${
                          index < review.rating ? "fill-primary text-primary" : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">"{t(review.quoteKey)}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {review.initial}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{review.name}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="mt-10 rounded-3xl bg-muted/40 px-6 py-14 text-center md:px-10 md:py-20" {...sectionContainer}>
            <motion.div className="mx-auto max-w-4xl" {...itemReveal}>
              <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                {t("landing.about.title")}
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {t("landing.about.p1")}
              </p>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {t("landing.about.p2")}
              </p>
            </motion.div>
          </motion.section>

          <motion.section className="mt-10 pb-16 md:pb-20" {...sectionContainer}>
            <motion.div
              className="mx-auto max-w-6xl rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/95 via-primary to-primary/90 px-6 py-8 text-primary-foreground shadow-[var(--shadow-gold)] md:px-10 md:py-10"
              {...itemReveal}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.35, ease: baseEase }}
            >
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
                <div className="flex gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
                      {t("landing.offer.badge")}
                    </span>
                    <h3 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
                      {t("landing.offer.titlePrefix")} <span className="text-amber-100">{t("landing.offer.titleHighlight")}</span> {t("landing.offer.titleSuffix")}
                    </h3>
                    <p className="mt-3 max-w-3xl text-base text-primary-foreground/90 md:text-lg">
                      {t("landing.offer.desc")}
                    </p>
                  </div>
                </div>

                <motion.button
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary-foreground/90"
                  whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  {t("landing.offer.claim")}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="mx-auto mt-5 max-w-6xl overflow-hidden rounded-2xl border border-border bg-card" {...itemReveal}>
              <div className="flex items-stretch text-sm">
                <span className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-semibold text-primary-foreground">
                  <Percent className="h-4 w-4" />
                  {t("landing.offer.liveOffers")}
                </span>
                <div className="live-offers-ticker">
                  <div className="live-offers-track">
                    {liveOffersTicker.map((offer, index) => (
                      <span
                        key={`${offer}-${index}`}
                        className="live-offers-item inline-flex items-center gap-2 px-5 py-3 text-muted-foreground"
                      >
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        {t(offer)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="mx-auto mt-5 grid max-w-6xl gap-4 md:grid-cols-3" {...itemReveal}>
              {quickServiceCards.map((item) => (
                <motion.div
                  key={item.titleKey}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]"
                  {...hoverLift}
                  transition={{ duration: 0.35, ease: baseEase }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold text-foreground">{t(item.titleKey)}</h4>
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                        {t(`landing.quick.tags.${item.tag.toLowerCase().replace(" ", "")}`)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t(item.descriptionKey)}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="mx-auto mt-16 max-w-4xl text-center" {...itemReveal}>
              <h3 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                {t("landing.city.title")}
              </h3>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {availableCities.map((city) => (
                  <motion.span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.04 }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {t(city)}
                  </motion.span>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("landing.city.subtitle")}</p>
            </motion.div>
          </motion.section>

          <motion.section
            className="mb-8 rounded-3xl border border-primary/25 bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] px-6 py-14 text-center text-primary-foreground shadow-[var(--shadow-gold)] md:px-10 md:py-20"
            {...sectionContainer}
          >
            <motion.h2 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl" {...itemReveal}>
              {t("landing.bottomCta.title")}
            </motion.h2>

            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-3" {...itemReveal}>
              <Link to="/book-visit">
                <motion.button
                  className="rounded-xl bg-primary-foreground px-7 py-3 text-base font-semibold text-primary transition hover:bg-primary-foreground/90"
                  whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  {t("landing.bottomCta.book")}
                </motion.button>
              </Link>
              <motion.button
                className="rounded-xl border border-primary-foreground/35 bg-primary-foreground/10 px-7 py-3 text-base font-semibold text-primary-foreground transition hover:bg-primary-foreground/20"
                whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                {t("landing.bottomCta.download")}
              </motion.button>
            </motion.div>
          </motion.section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
