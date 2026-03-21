import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import ServicesShowcase from "@/components/ServicesShowcase";
import OffersScroller from "@/components/OffersScroller";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import BenefitsSection from "@/components/BenefitsSection";
import CTASection from "@/components/CTASection";
import { motion } from "framer-motion";

const Index = () => (
  <div className="min-h-screen">
    <Header hideNavLinks />
    <HeroBanner />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <ServicesShowcase />
      <OffersScroller />
      <CategoryGrid />
      <FeaturedDesigns />
      <CTASection />
      <BenefitsSection />
    </motion.div>
    <Footer />
  </div>
);

export default Index;
