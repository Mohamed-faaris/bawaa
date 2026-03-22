import { useMemo, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { useConvex } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { Button } from "@bawaa/ui/button";
import { toast } from "sonner";
import { useAdminSession } from "@/hooks/useAdminSession";

const AdminMobileLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const convex = useConvex();
  const { isAuthenticated, setAuthenticated } = useAdminSession();
  const [isVerifying, setIsVerifying] = useState(false);

  const configuredSecret = import.meta.env.VITE_ADMIN_SECRET;
  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? "/admin-mobile";
  }, [location.state]);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleVerify = async () => {
    if (!configuredSecret) {
      toast.error("VITE_ADMIN_SECRET is missing");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await convex.query(api.admin.verifySecret, {
        secret: configuredSecret,
      });

      if (!result.valid) {
        toast.error(result.error ?? "Admin secret verification failed");
        return;
      }

      setAuthenticated(true);
      toast.success("Admin access verified");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Could not verify admin access");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6">
            <Shield className="text-accent-foreground" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Admin Portal
          </h1>
          <p className="text-muted-foreground text-base">
            Bawaa Medicals quick dashboard access
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Convex endpoint configured
                </p>
                <p className="text-xs text-muted-foreground break-all">
                  {import.meta.env.VITE_CONVEX_URL || "Missing VITE_CONVEX_URL"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Secret-based admin verification
                </p>
                <p className="text-xs text-muted-foreground">
                  The app will verify the configured `VITE_ADMIN_SECRET` against
                  Convex before allowing access.
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !configuredSecret}
            className="w-full h-13 rounded-xl text-base font-semibold gap-2 bg-accent hover:bg-accent/90"
          >
            {isVerifying ? "Verifying..." : "Verify Access"}{" "}
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMobileLoginPage;
