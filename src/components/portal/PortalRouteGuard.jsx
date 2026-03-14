import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { clearPortalSession, hasPortalRole } from "@/lib/portalAuth";
import { Loader2 } from "lucide-react";

export default function PortalRouteGuard({ role, loginPath, verifyApi, children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!hasPortalRole(role)) {
        if (!cancelled) setStatus("denied");
        return;
      }

      try {
        await verifyApi();
        if (!cancelled) setStatus("allowed");
      } catch (error) {
        clearPortalSession();
        if (!cancelled) setStatus("denied");
      }
    };

    verifySession();
    return () => {
      cancelled = true;
    };
  }, [role, verifyApi]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
