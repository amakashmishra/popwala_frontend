import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gold-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <Link to="/" className="font-display text-3xl font-bold">CeiloCraft</Link>
          <h2 className="mt-8 font-display text-4xl font-bold leading-tight">{t("auth.heroTitle")}</h2>
          <p className="mt-4 opacity-80">{t("auth.heroDesc")}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-display text-2xl font-semibold mb-8 block">
            Ceilo<span className="gold-text">Craft</span>
          </Link>

          <h1 className="font-display text-2xl font-bold">{isLogin ? t("auth.welcome") : t("auth.create")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isLogin ? t("auth.signInDesc") : t("auth.signUpDesc")}</p>

          <Button variant="outline" className="w-full mt-6 gap-2 h-11">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t("auth.google")}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("auth.orEmail")}</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" placeholder={t("auth.fullName")} className="mt-1.5 h-11" />
              </div>
            )}
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <div className="relative">
                <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5 h-11 pr-10" />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.password")}</Label>
                {isLogin && (
                  <button type="button" className="text-xs text-primary hover:underline">{t("auth.forgot")}</button>
                )}
              </div>
              <div className="relative">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" className="mt-1.5 h-11 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 gold-gradient border-0 text-primary-foreground font-semibold">
              {isLogin ? t("auth.signIn") : t("auth.createAccount")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? t("auth.signUp") : t("auth.signIn")}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
