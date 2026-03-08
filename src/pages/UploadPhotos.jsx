import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, ImagePlus, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import catHouse from "@/assets/cat-house.jpg";
import catBedroom from "@/assets/cat-bedroom.jpg";
import catHall from "@/assets/cat-hall.jpg";

const suggestions = [
  { image: catHouse, title: "Modern Cove Design", match: "92%", type: "POP" },
  { image: catBedroom, title: "PVC 3D Textured Panel", match: "89%", type: "PVC" },
  { image: catHall, title: "Ornate Classic Ceiling", match: "81%", type: "POP" },
];

const UploadPhotos = () => {
  const [files, setFiles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useLanguage();

  const handleUpload = () => {
    setFiles(["room-photo-1.jpg", "room-photo-2.jpg"]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl">
          <h1 className="font-display text-3xl font-bold">{t("upload.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("upload.subtitle")}</p>

          <div
            onClick={handleUpload}
            className="mt-8 border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <ImagePlus className="w-12 h-12 mx-auto text-primary/50 mb-4" />
            <p className="font-medium">{t("upload.click")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("upload.format")}</p>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm font-medium">{f}</span>
                      <button onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setShowSuggestions(true)}
                  className="mt-4 gold-gradient border-0 text-primary-foreground font-semibold gap-2"
                >
                  <Sparkles className="w-4 h-4" /> {t("upload.getSuggestions")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> {t("upload.recommended")}
                </h2>
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="rounded-xl overflow-hidden border border-border card-hover bg-card"
                    >
                      <div className="relative">
                        <img src={s.image} alt={s.title} className="w-full aspect-[4/3] object-cover" />
                        <span className="absolute top-2 right-2 bg-card/90 text-xs font-semibold px-2 py-0.5 rounded-full">{s.type}</span>
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{s.title}</p>
                        <p className="text-primary text-xs font-semibold mt-1">{s.match} {t("upload.match")}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadPhotos;
