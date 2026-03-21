import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "@/components/ui/sonner";
import { authApi } from "@/lib/api";

const Auth = () => {
  const [viewMode, setViewMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [devResetToken, setDevResetToken] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    identifier: "",
    password: "",
    otp: "",
    resetToken: "",
    newPassword: "",
  });

  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isLogin = viewMode === "login";
  const isSignup = viewMode === "signup";
  const isForgot = viewMode === "forgot";
  const isVerify = viewMode === "verify";
  const isResetStep = Boolean(devResetToken || form.resetToken);

  const setWebUserSession = (user, shouldRemember = true) => {
    localStorage.removeItem("ceilocraft-user");
    sessionStorage.removeItem("ceilocraft-user");
    if (shouldRemember) {
      localStorage.setItem("ceilocraft-user", JSON.stringify(user));
      return;
    }
    sessionStorage.setItem("ceilocraft-user", JSON.stringify(user));
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const googleStatus = searchParams.get("google");
    if (!googleStatus) return;

    if (googleStatus === "success") {
      authApi
        .me()
        .then((data) => {
          if (data?.user) {
            setWebUserSession(data.user, true);
          }
          toast.success("Google login successful");
          navigate("/home", { replace: true });
        })
        .catch(() => {
          toast.error("Google login finished but session validation failed");
          setSearchParams({});
        });
      return;
    }

    toast.error("Google login failed. Please try again.");
    setSearchParams({});
  }, [navigate, searchParams, setSearchParams]);

  const handleSignup = async () => {
    const data = await authApi.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.trim(),
      password: form.password,
    });

    setVerifyEmail(form.email.trim().toLowerCase());
    setDevOtp(data?.otp || "");
    setViewMode("verify");
    toast.success("Account created. Verify your email with OTP.");
  };

  const handleVerifyOtp = async () => {
    await authApi.verifyEmailOtp({
      email: verifyEmail,
      otp: form.otp.trim(),
    });
    setViewMode("login");
    updateForm("identifier", verifyEmail);
    updateForm("otp", "");
    toast.success("Email verified. You can now login.");
  };

  const handleResendOtp = async () => {
    const data = await authApi.resendEmailOtp({ email: verifyEmail });
    if (data?.alreadyVerified) {
      toast.success("Email already verified. Please login.");
      setViewMode("login");
      return;
    }
    if (data?.otp) setDevOtp(data.otp);
    toast.success("OTP resent to your email.");
  };

  const handleLogin = async () => {
    const loginData = await authApi.login({
      identifier: form.identifier.trim(),
      password: form.password,
      rememberMe,
    });

    if (loginData?.user) {
      setWebUserSession(loginData.user, rememberMe);
    }

    toast.success("Signed in successfully");
    navigate("/home");
  };

  const handleForgot = async () => {
    if (!isResetStep) {
      const data = await authApi.forgotPassword({ identifier: form.identifier.trim() });
      if (data?.resetToken) {
        setDevResetToken(data.resetToken);
      }
      toast.success("Reset token sent to your email.");
      return;
    }

    await authApi.resetPassword({
      token: form.resetToken.trim() || devResetToken,
      newPassword: form.newPassword,
    });
    setDevResetToken("");
    updateForm("resetToken", "");
    updateForm("newPassword", "");
    setViewMode("login");
    toast.success("Password reset successful. Please sign in.");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignup) await handleSignup();
      else if (isVerify) await handleVerifyOtp();
      else if (isForgot) await handleForgot();
      else await handleLogin();
    } catch (error) {
      toast.error(error.message || "Request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gold-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <Link to="/" className="font-display text-3xl font-bold">
            CeiloCraft
          </Link>
          <h2 className="mt-8 font-display text-4xl font-bold leading-tight">{t("auth.heroTitle")}</h2>
          <p className="mt-4 opacity-80">{t("auth.heroDesc")}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-display text-2xl font-semibold mb-8 block">
            Ceilo<span className="gold-text">Craft</span>
          </Link>

          <h1 className="font-display text-2xl font-bold">
            {isSignup ? "Create your account" : isVerify ? "Verify email OTP" : isForgot ? "Reset your password" : "Welcome back"}
          </h1>

          <Button
            variant="outline"
            className="w-full mt-6 gap-2 h-11"
            type="button"
            disabled={isSubmitting || isForgot || isVerify}
            onClick={() => {
              window.location.href = authApi.getGoogleUrl(`${window.location.origin}/auth`);
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("auth.google")}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("auth.orEmail")}</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {isSignup && (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" className="mt-1.5 h-11" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      className="mt-1.5 h-11 pr-10"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Input
                      id="mobile"
                      className="mt-1.5 h-11 pr-10"
                      value={form.mobile}
                      onChange={(e) => updateForm("mobile", e.target.value)}
                      placeholder="10-15 digits"
                      required
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </>
            )}

            {(isLogin || isForgot) && (
              <div>
                <Label htmlFor="identifier">Email or Mobile</Label>
                <Input
                  id="identifier"
                  className="mt-1.5 h-11"
                  value={form.identifier}
                  onChange={(e) => updateForm("identifier", e.target.value)}
                  required
                />
              </div>
            )}

            {isVerify && (
              <>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1.5 h-11" value={verifyEmail} disabled />
                </div>
                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    className="mt-1.5 h-11"
                    value={form.otp}
                    onChange={(e) => updateForm("otp", e.target.value)}
                    placeholder="6 digit OTP"
                    required
                  />
                </div>
                {devOtp && <p className="text-xs text-muted-foreground">Dev OTP: {devOtp}</p>}
                <Button type="button" variant="outline" className="w-full h-10" onClick={handleResendOtp} disabled={isSubmitting}>
                  Resend OTP
                </Button>
              </>
            )}

            {(isLogin || isSignup) && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <button type="button" className="text-xs text-primary hover:underline" onClick={() => setViewMode("forgot")}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    className="mt-1.5 h-11 pr-10"
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                Remember Me
              </label>
            )}

            {isForgot && (
              <>
                {devResetToken && <p className="text-xs text-muted-foreground">Dev reset token: {devResetToken}</p>}
                <div>
                  <Label htmlFor="resetToken">Reset Token</Label>
                  <Input
                    id="resetToken"
                    className="mt-1.5 h-11"
                    value={form.resetToken}
                    onChange={(e) => updateForm("resetToken", e.target.value)}
                    placeholder="Paste token from email"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showPass ? "text" : "password"}
                    className="mt-1.5 h-11"
                    value={form.newPassword}
                    onChange={(e) => updateForm("newPassword", e.target.value)}
                    required={isResetStep}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full h-11 gold-gradient border-0 text-primary-foreground font-semibold" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSignup
                ? "Create Account"
                : isVerify
                  ? "Verify OTP"
                  : isForgot
                    ? isResetStep
                      ? "Reset Password"
                      : "Send Reset Token"
                    : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin && (
              <>
                Don't have an account?{" "}
                <button onClick={() => setViewMode("signup")} className="text-primary font-medium hover:underline">
                  Sign up
                </button>
              </>
            )}

            {isSignup && (
              <>
                Already have an account?{" "}
                <button onClick={() => setViewMode("login")} className="text-primary font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}

            {(isForgot || isVerify) && (
              <>
                Back to{" "}
                <button onClick={() => setViewMode("login")} className="text-primary font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
