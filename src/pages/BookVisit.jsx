import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const BookVisit = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container max-w-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-bold">{t("bookVisit.title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("bookVisit.subtitle")}</p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-5 bg-card p-6 md:p-8 rounded-2xl border border-border"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t("bookVisit.name")} *</Label>
                      <Input id="name" required placeholder={t("bookVisit.name")} className="mt-1.5 h-11" />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("bookVisit.phone")} *</Label>
                      <Input id="phone" required placeholder="+91 98765 43210" className="mt-1.5 h-11" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">{t("bookVisit.address")} *</Label>
                    <Textarea id="address" required placeholder={t("bookVisit.address")} className="mt-1.5" rows={3} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{t("bookVisit.siteType")} *</Label>
                      <Select>
                        <SelectTrigger className="mt-1.5 h-11">
                          <SelectValue placeholder={t("bookVisit.selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          {["House", "Apartment", "Hall", "Hotel", "Office", "Mall", "Shop", "Other"].map((tp) => (
                            <SelectItem key={tp} value={tp.toLowerCase()}>{tp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t("bookVisit.serviceType")} *</Label>
                      <Select>
                        <SelectTrigger className="mt-1.5 h-11">
                          <SelectValue placeholder={t("bookVisit.selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">POP (Plaster of Paris)</SelectItem>
                          <SelectItem value="pvc">PVC (Polyvinyl Chloride)</SelectItem>
                          <SelectItem value="both">POP + PVC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="date">{t("bookVisit.date")} *</Label>
                    <Input id="date" type="date" required className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label htmlFor="notes">{t("bookVisit.notes")}</Label>
                    <Textarea id="notes" placeholder={t("bookVisit.notes")} className="mt-1.5" rows={3} />
                  </div>
                  <Button type="submit" className="w-full h-12 gold-gradient border-0 text-primary-foreground font-semibold text-base">
                    {t("bookVisit.submit")}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold">{t("bookVisit.success")}</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t("bookVisit.successDesc")}</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">
                  {t("bookVisit.another")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookVisit;
