import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Gift, Copy, Heart, ClipboardList, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const bookings = [
  { id: "BK001", site: "3BHK Apartment, Andheri", date: "Feb 28, 2026", status: "Confirmed", type: "POP" },
  { id: "BK002", site: "Banquet Hall, Powai", date: "Mar 5, 2026", status: "Inspection Completed", type: "POP" },
  { id: "BK003", site: "Office Space, BKC", date: "Mar 12, 2026", status: "Estimate Shared", type: "PVC" },
];

const statusColor = {
  Requested: "bg-muted text-muted-foreground",
  Confirmed: "bg-blue-100 text-blue-700",
  "Inspection Completed": "bg-amber-100 text-amber-700",
  "Estimate Shared": "bg-green-100 text-green-700",
  "Work Started": "bg-primary/20 text-primary",
  Completed: "bg-green-200 text-green-800",
};

const Dashboard = () => {
  const referralCode = "CEILO-AB12XY";
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container">
          <h1 className="font-display text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("dashboard.welcome")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: ClipboardList, label: t("dashboard.activeBookings"), value: "3" },
              { icon: Heart, label: t("dashboard.savedDesigns"), value: "12" },
              { icon: Wallet, label: t("dashboard.rewardPoints"), value: "450" },
              { icon: TrendingUp, label: t("dashboard.referrals"), value: "5" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="p-5">
                    <stat.icon className="w-5 h-5 text-primary mb-2" />
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">{t("dashboard.siteVisits")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                      <div>
                        <p className="font-medium text-sm">{b.site}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {b.id} · {b.date} · <Badge variant="outline" className="text-xs">{b.type}</Badge>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={statusColor[b.status]}>
                          {b.status}
                        </Badge>
                        {(b.status === "Estimate Shared" || b.status === "Inspection Completed") && (
                          <Link to={`/project/${b.id}`}>
                            <Button size="sm" variant="outline" className="gap-1 text-xs">
                              {t("dashboard.viewReport")} <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" /> {t("dashboard.rewardWallet")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 rounded-xl gold-gradient text-primary-foreground">
                    <p className="text-3xl font-display font-bold">450</p>
                    <p className="text-sm opacity-80">{t("dashboard.availablePoints")}</p>
                    <p className="text-xs opacity-60 mt-1">{t("dashboard.pointValue")}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="font-semibold">600</p>
                      <p className="text-xs text-muted-foreground">{t("dashboard.totalEarned")}</p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="font-semibold">150</p>
                      <p className="text-xs text-muted-foreground">{t("dashboard.used")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" /> {t("dashboard.referEarn")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t("dashboard.referDesc")}</p>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm font-mono font-medium">
                      {referralCode}
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => { navigator.clipboard.writeText(referralCode); toast.success("Code copied!"); }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
