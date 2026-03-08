import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, IndianRupee, Clock, Layers, CheckCircle2, Circle, Loader2, UserX, AlertTriangle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const mockProjects = {
  BK001: {
    id: "BK001",
    site: "3BHK Apartment, Andheri",
    status: "Estimate Shared",
    type: "POP",
    design: "Modern Cove Ceiling with LED Lighting",
    totalCost: 125000,
    materials: [
      { name: "POP Material (Grade A)", qty: "120 sq ft", cost: 36000 },
      { name: "LED Strip Lighting", qty: "40 meters", cost: 12000 },
      { name: "Paint & Finish (Asian Paints)", qty: "Full coat", cost: 18000 },
      { name: "Labour Charges", qty: "5 days", cost: 35000 },
      { name: "Design & Architecture Fee", qty: "Flat", cost: 15000 },
      { name: "Miscellaneous", qty: "-", cost: 9000 },
    ],
    timeline: "12–15 working days",
    architectNotes: "The site has good ceiling height (10ft). Recommended a modern cove design with recessed warm-white LED strips along the perimeter.",
    paymentPhases: [
      { label: "Advance Payment (20%)", percent: 20, amount: 25000, status: "pending" },
      { label: "Mid-Project Payment (60%)", percent: 60, amount: 75000, status: "locked" },
      { label: "Completion Payment (20%)", percent: 20, amount: 25000, status: "locked" },
    ],
  },
  BK002: {
    id: "BK002",
    site: "Banquet Hall, Powai",
    status: "Inspection Completed",
    type: "POP",
    design: "Royal Gold Ornate Ceiling",
    totalCost: 320000,
    materials: [
      { name: "POP Material (Premium)", qty: "450 sq ft", cost: 112500 },
      { name: "Gold Leaf Accents", qty: "60 sq ft", cost: 48000 },
      { name: "Chandelier Mounting", qty: "3 units", cost: 30000 },
      { name: "Paint & Finish", qty: "Full coat", cost: 35000 },
      { name: "Labour Charges", qty: "15 days", cost: 60000 },
      { name: "Design Fee", qty: "Flat", cost: 25000 },
      { name: "Miscellaneous", qty: "-", cost: 9500 },
    ],
    timeline: "25–30 working days",
    architectNotes: "Large banquet space with 14ft ceilings. Proposed an ornate multi-layered POP design with gold accents and 3 chandelier mounting points.",
    paymentPhases: [
      { label: "Advance Payment (20%)", percent: 20, amount: 64000, status: "pending" },
      { label: "Mid-Project Payment (60%)", percent: 60, amount: 192000, status: "locked" },
      { label: "Completion Payment (20%)", percent: 20, amount: 64000, status: "locked" },
    ],
  },
  BK003: {
    id: "BK003",
    site: "Office Space, BKC",
    status: "Estimate Shared",
    type: "PVC",
    design: "PVC Premium Grid Ceiling",
    totalCost: 85000,
    materials: [
      { name: "PVC Panels (Premium)", qty: "200 sq ft", cost: 30000 },
      { name: "PVC Framework & Channels", qty: "200 sq ft", cost: 16000 },
      { name: "Recessed Panel Lights", qty: "12 units", cost: 14400 },
      { name: "Paint & Finish", qty: "Full coat", cost: 6000 },
      { name: "Labour Charges", qty: "4 days", cost: 12000 },
      { name: "Design Fee", qty: "Flat", cost: 5000 },
      { name: "Miscellaneous", qty: "-", cost: 1600 },
    ],
    timeline: "5–7 working days",
    architectNotes: "Corporate office with standard 9ft ceiling. Recommended PVC grid ceiling panels — waterproof, lightweight, and low maintenance. Perfect for offices.",
    paymentPhases: [
      { label: "Advance Payment (20%)", percent: 20, amount: 17000, status: "pending" },
      { label: "Mid-Project Payment (60%)", percent: 60, amount: 51000, status: "locked" },
      { label: "Completion Payment (20%)", percent: 20, amount: 17000, status: "locked" },
    ],
  },
};

const phaseIcon = (status) => {
  if (status === "paid") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  if (status === "pending") return <Circle className="w-5 h-5 text-primary" />;
  return <Circle className="w-5 h-5 text-muted-foreground/40" />;
};

const ProjectReport = () => {
  const { id } = useParams();
  const project = mockProjects[id || "BK001"] || mockProjects["BK001"];
  const [paying, setPaying] = useState(false);
  const [workerChangeOpen, setWorkerChangeOpen] = useState(false);
  const [workerReason, setWorkerReason] = useState("");
  const { t } = useLanguage();

  const handlePay = (phase) => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      toast.success(`Payment of ₹${phase.amount.toLocaleString("en-IN")} initiated! Redirecting to payment gateway...`);
    }, 1500);
  };

  const handleWorkerChange = () => {
    if (!workerReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    toast.success(t("worker.success"));
    setWorkerChangeOpen(false);
    setWorkerReason("");
  };

  const paidTotal = project.paymentPhases
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const progressPercent = Math.round((paidTotal / project.totalCost) * 100);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> {t("report.back")}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">{project.site}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Booking #{project.id} · <Badge variant="outline" className="text-xs">{project.type}</Badge>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">{project.status}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => setWorkerChangeOpen(true)}
                >
                  <UserX className="w-3.5 h-3.5" />
                  {t("worker.requestChange")}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Worker Change Request Modal */}
          <AnimatePresence>
            {workerChangeOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
                onClick={() => setWorkerChangeOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">{t("worker.title")}</h3>
                      <p className="text-xs text-muted-foreground">{project.site}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{t("worker.desc")}</p>
                  <Textarea
                    value={workerReason}
                    onChange={(e) => setWorkerReason(e.target.value)}
                    placeholder={t("worker.reasonPlaceholder")}
                    rows={4}
                    className="mb-4"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => setWorkerChangeOpen(false)}>
                      {t("worker.cancel")}
                    </Button>
                    <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleWorkerChange}>
                      {t("worker.submit")}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Architect Report */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> {t("report.architectReport")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("report.recommendedDesign")}</p>
                  <p className="font-semibold">{project.design}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("report.architectNotes")}</p>
                  <p className="text-sm leading-relaxed">{project.architectNotes}</p>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("report.timeline")}</p>
                      <p className="text-sm font-medium">{project.timeline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("report.totalCost")}</p>
                      <p className="text-sm font-medium">₹{project.totalCost.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> {t("report.costBreakdown")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-muted-foreground">{t("report.item")}</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">{t("report.quantity")}</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">{t("report.cost")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.materials.map((m, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2.5">{m.name}</td>
                          <td className="py-2.5 text-muted-foreground">{m.qty}</td>
                          <td className="py-2.5 text-right font-medium">₹{m.cost.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="py-3 font-semibold" colSpan={2}>{t("report.total")}</td>
                        <td className="py-3 text-right font-bold text-primary">₹{project.totalCost.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Schedule */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary" /> {t("report.paymentSchedule")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{t("report.paymentProgress")}</span>
                    <span className="font-medium">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2.5" />
                </div>

                <div className="space-y-4">
                  {project.paymentPhases.map((phase, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        phase.status === "pending"
                          ? "border-primary/30 bg-primary/5"
                          : phase.status === "paid"
                          ? "border-green-200 bg-green-50"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      {phaseIcon(phase.status)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{phase.label}</p>
                        <p className="text-xs text-muted-foreground">{phase.percent}% {t("report.ofTotal")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{phase.amount.toLocaleString("en-IN")}</p>
                        {phase.status === "pending" && (
                          <Button
                            size="sm"
                            className="mt-2 gold-gradient border-0 text-primary-foreground font-semibold gap-1.5"
                            onClick={() => handlePay(phase)}
                            disabled={paying}
                          >
                            {paying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <IndianRupee className="w-3.5 h-3.5" />}
                            {t("report.payNow")}
                          </Button>
                        )}
                        {phase.status === "paid" && (
                          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">{t("report.paid")}</Badge>
                        )}
                        {phase.status === "locked" && (
                          <span className="text-xs text-muted-foreground mt-2 block">{t("report.unlocksLater")}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectReport;
