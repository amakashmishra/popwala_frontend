import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { hasPortalRole, setPortalSession } from "@/lib/portalAuth";

export default function RoleLoginPage({ role, title, description, loginApi, homePath }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasPortalRole(role)) {
      navigate(homePath, { replace: true });
    }
  }, [homePath, navigate, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({
        identifier: identifier.trim(),
        email: identifier.trim(),
        password,
        rememberMe,
      });
      setPortalSession(role, data.user || null, rememberMe);
      toast.success(`${title} login successful`);
      navigate(homePath, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-display">{title} Login</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor={`${role}-identifier`}>Email or Mobile</Label>
              <Input
                id={`${role}-identifier`}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor={`${role}-password`}>Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id={`${role}-password`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 accent-[hsl(var(--primary))]"
              />
              Remember Me
            </label>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
          <Link to="/" className="block mt-4 text-center text-sm text-muted-foreground hover:text-foreground">
            Back to website
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
