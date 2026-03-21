import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const botResponses = {
  designs: {
    en: "We offer a wide range of POP & PVC ceiling designs including Modern Cove, Royal Gold, Minimalist Tray, Grid Pattern, PVC Waterproof Panels, PVC 3D Textured Panels, and fully custom designs. You can browse our gallery or upload photos for AI-powered suggestions!",
    hi: "हम POP और PVC सीलिंग डिज़ाइन की विस्तृत श्रृंखला प्रदान करते हैं जिसमें Modern Cove, Royal Gold, Minimalist Tray, Grid Pattern, PVC वॉटरप्रूफ पैनल, PVC 3D टेक्सचर्ड पैनल और पूरी तरह से कस्टम डिज़ाइन शामिल हैं। आप हमारी गैलरी ब्राउज़ कर सकते हैं!",
    mr: "आम्ही POP आणि PVC सीलिंग डिझाइनची विस्तृत श्रेणी देतो ज्यात Modern Cove, Royal Gold, Minimalist Tray, Grid Pattern, PVC वॉटरप्रूफ पॅनल, PVC 3D टेक्सचर्ड पॅनल आणि पूर्णपणे कस्टम डिझाइन समाविष्ट आहेत. तुम्ही आमची गॅलरी ब्राउझ करू शकता!",
  },
  visit: {
    en: "You can book a free site visit from our 'Book Visit' page. Our expert architect will visit your location, inspect the area, and share a detailed report with design proposals, material details, estimated costs, and a project timeline.",
    hi: "आप हमारे 'विज़िट बुक करें' पेज से मुफ़्त साइट विज़िट बुक कर सकते हैं। हमारे विशेषज्ञ वास्तुकार आपके स्थान पर आएंगे, क्षेत्र का निरीक्षण करेंगे और डिज़ाइन प्रस्ताव, सामग्री विवरण, अनुमानित लागत और प्रोजेक्ट टाइमलाइन के साथ विस्तृत रिपोर्ट साझा करेंगे।",
    mr: "तुम्ही आमच्या 'भेट बुक करा' पेजवरून मोफत साइट भेट बुक करू शकता. आमचे तज्ञ वास्तुविशारद तुमच्या ठिकाणी भेट देतील, क्षेत्राचे निरीक्षण करतील आणि डिझाइन प्रस्ताव, साहित्य तपशील, अंदाजित खर्च आणि प्रकल्प टाइमलाइनसह तपशीलवार अहवाल शेअर करतील.",
  },
  payment: {
    en: "We follow a 3-phase payment structure:\n• 20% Advance – before work begins\n• 60% Mid-project – during execution\n• 20% On completion – after final inspection\nAll payments are secure and tracked in your dashboard.",
    hi: "हम 3-चरणीय भुगतान संरचना का पालन करते हैं:\n• 20% अग्रिम – काम शुरू होने से पहले\n• 60% मध्य-प्रोजेक्ट – निष्पादन के दौरान\n• 20% पूर्ण होने पर – अंतिम निरीक्षण के बाद\nसभी भुगतान सुरक्षित हैं और आपके डैशबोर्ड में ट्रैक किए जाते हैं।",
    mr: "आम्ही 3-टप्प्यांची पेमेंट रचना फॉलो करतो:\n• 20% अॅडव्हान्स – काम सुरू होण्यापूर्वी\n• 60% मध्य-प्रकल्प – अंमलबजावणी दरम्यान\n• 20% पूर्ण झाल्यावर – अंतिम तपासणीनंतर\nसर्व पेमेंट सुरक्षित आहेत आणि तुमच्या डॅशबोर्डमध्ये ट्रॅक केले जातात.",
  },
  referral: {
    en: "Share your referral code with friends. When they register, you earn 100 points. If they purchase any service, you get an additional 300 points. 1 point = ₹1 discount on any service!",
    hi: "अपने रेफ़रल कोड को दोस्तों के साथ साझा करें। जब वे रजिस्टर करते हैं, तो आप 100 अंक कमाते हैं। यदि वे कोई सेवा खरीदते हैं, तो आपको अतिरिक्त 300 अंक मिलते हैं। 1 अंक = किसी भी सेवा पर ₹1 छूट!",
    mr: "तुमचा रेफरल कोड मित्रांसोबत शेअर करा. ते नोंदणी करतात तेव्हा तुम्हाला 100 गुण मिळतात. त्यांनी कोणतीही सेवा खरेदी केल्यास तुम्हाला अतिरिक्त 300 गुण मिळतात. 1 गुण = कोणत्याही सेवेवर ₹1 सवलत!",
  },
  pvc: {
    en: "We offer premium PVC ceiling solutions! PVC ceilings are waterproof, lightweight, easy to maintain, and quick to install. Perfect for kitchens, bathrooms, offices, and commercial spaces. Browse our PVC designs in the gallery!",
    hi: "हम प्रीमियम PVC सीलिंग समाधान प्रदान करते हैं! PVC सीलिंग वॉटरप्रूफ, हल्की, रखरखाव में आसान और जल्दी इंस्टॉल होने वाली होती है। किचन, बाथरूम, ऑफिस और कमर्शियल स्पेस के लिए बिल्कुल सही। गैलरी में हमारे PVC डिज़ाइन देखें!",
    mr: "आम्ही प्रीमियम PVC सीलिंग सोल्यूशन्स देतो! PVC सीलिंग वॉटरप्रूफ, हलक्या, देखभाल करणे सोपे आणि जलद इंस्टॉल होणारे आहेत. स्वयंपाकघर, बाथरूम, ऑफिस आणि व्यावसायिक जागांसाठी उत्तम. गॅलरीमध्ये आमचे PVC डिझाइन पहा!",
  },
  worker: {
    en: "If you're not satisfied with a worker during your project, you can request a worker change from the Project Report page. Go to Dashboard → View Report → Click 'Request Worker Change'. Our team will arrange a replacement within 24 hours!",
    hi: "अगर आप प्रोजेक्ट के दौरान किसी कर्मचारी से संतुष्ट नहीं हैं, तो आप प्रोजेक्ट रिपोर्ट पेज से कर्मचारी बदलने का अनुरोध कर सकते हैं। डैशबोर्ड → रिपोर्ट देखें → 'कर्मचारी बदलने का अनुरोध' पर क्लिक करें। हमारी टीम 24 घंटों में बदलाव करेगी!",
    mr: "तुम्ही प्रकल्पादरम्यान कामगारावर समाधानी नसल्यास, तुम्ही प्रकल्प अहवाल पेजवरून कामगार बदल विनंती करू शकता. डॅशबोर्ड → अहवाल पहा → 'कामगार बदल विनंती' वर क्लिक करा. आमची टीम 24 तासांत बदली करेल!",
  },
  default: {
    en: "Thanks for your question! Our team will get back to you shortly. You can also call us or connect via WhatsApp for instant support. 😊",
    hi: "आपके प्रश्न के लिए धन्यवाद! हमारी टीम जल्द ही आपसे संपर्क करेगी। आप तत्काल सहायता के लिए हमें कॉल भी कर सकते हैं या WhatsApp से जुड़ सकते हैं। 😊",
    mr: "तुमच्या प्रश्नाबद्दल धन्यवाद! आमची टीम लवकरच तुमच्याशी संपर्क करेल. तत्काळ सहाय्यासाठी तुम्ही आम्हाला कॉल करू शकता किंवा WhatsApp द्वारे कनेक्ट होऊ शकता. 😊",
  },
};

const getReply = (input, lang) => {
  const lower = input.toLowerCase().trim();
  if (lower.includes("design") || lower.includes("डिज़ाइन") || lower.includes("डिझाइन")) return botResponses.designs[lang] || botResponses.designs.en;
  if (lower.includes("pvc")) return botResponses.pvc[lang] || botResponses.pvc.en;
  if (lower.includes("visit") || lower.includes("architect") || lower.includes("विज़िट") || lower.includes("भेट")) return botResponses.visit[lang] || botResponses.visit.en;
  if (lower.includes("pay") || lower.includes("cost") || lower.includes("price") || lower.includes("भुगतान") || lower.includes("पेमेंट")) return botResponses.payment[lang] || botResponses.payment.en;
  if (lower.includes("refer") || lower.includes("reward") || lower.includes("point") || lower.includes("रेफ़रल") || lower.includes("रेफरल")) return botResponses.referral[lang] || botResponses.referral.en;
  if (lower.includes("worker") || lower.includes("कर्मचारी") || lower.includes("कामगार") || lower.includes("change") || lower.includes("बदल")) return botResponses.worker[lang] || botResponses.worker.en;
  return botResponses.default[lang] || botResponses.default.en;
};

  const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([{ role: "bot", text: t("chatbot.greeting") }]);
    setInitialized(true);
  }, [language, t]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = [t("chatbot.q1"), t("chatbot.q2"), t("chatbot.q3"), t("chatbot.q4")];

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getReply(text, language) }]);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[hsl(var(--gold))]/30"
              animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[hsl(var(--gold-light))]/35"
              animate={{ scale: [1, 1.65], opacity: [0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.45 }}
            />
            <motion.button
              onClick={() => setOpen(true)}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="relative w-14 h-14 rounded-full gold-gradient shadow-[var(--shadow-gold)] flex items-center justify-center text-primary-foreground"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="gold-gradient px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="w-5 h-5" />
                <span className="font-display font-semibold text-sm">{t("chatbot.name")}</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder={t("chatbot.ask")}
                className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button size="icon" className="gold-gradient border-0 text-primary-foreground rounded-xl" onClick={() => send(input)}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
