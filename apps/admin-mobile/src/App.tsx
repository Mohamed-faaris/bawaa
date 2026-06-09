import { useEffect } from "react";
import { useState } from "react";
import { Toaster } from "@bawaa/ui/toaster";
import { Toaster as Sonner } from "@bawaa/ui/sonner";
import { TooltipProvider } from "@bawaa/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { api } from "@bawaa/convex-db/convex/_generated/api";

import AdminMobileBottomNav from "@/components/AdminMobileBottomNav";
import { useFcmToken } from "@/hooks/useFcmToken";

import AdminMobileDashboardPage from "@/pages/AdminMobileDashboardPage";
import AdminMobileOrdersPage from "@/pages/AdminMobileOrdersPage";
import AdminMobileOrderDetailPage from "@/pages/AdminMobileOrderDetailPage";
import AdminMobileAlertsPage from "@/pages/AdminMobileAlertsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const NavigationBars = () => {
  const location = useLocation();
  const path = location.pathname;

  const isAdminMobile = path.startsWith("/admin-mobile");

  return isAdminMobile ? <AdminMobileBottomNav /> : null;
};

const FullScreenMessage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <div className="glass-card p-6 text-center max-w-sm w-full">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
        <ShieldAlert size={24} />
      </div>
      <h1 className="text-xl font-extrabold text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const AppShell = () => {
  const convex = useConvex();
  const [authState, setAuthState] = useState<
    "checking" | "authorized" | "unauthorized"
  >("checking");
  const configuredSecret = import.meta.env.VITE_ADMIN_SECRET;

  useEffect(() => {
    let cancelled = false;

    if (!configuredSecret) {
      setAuthState("unauthorized");
      return;
    }

    void convex
      .query(api.admin.verifySecret, { secret: configuredSecret })
      .then((result) => {
        if (cancelled) {
          return;
        }
        setAuthState(result.valid ? "authorized" : "unauthorized");
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) {
          setAuthState("unauthorized");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [configuredSecret, convex]);

  if (authState === "checking") {
    return (
      <FullScreenMessage
        title="Verifying admin access"
        description="Checking the configured admin secret with Convex before loading the dashboard."
      />
    );
  }

  if (authState === "unauthorized") {
    return (
      <FullScreenMessage
        title="Access denied"
        description="The admin secret in apps/admin-mobile/.env is missing or does not match the Convex backend."
      />
    );
  }

  return (
    <BrowserRouter>
      <NavigationBars />
      <Routes>
        <Route path="/" element={<Navigate to="/admin-mobile" replace />} />
        <Route path="/admin-mobile/login" element={<Navigate to="/admin-mobile" replace />} />
        <Route path="/admin-mobile" element={<AdminMobileDashboardPage />} />
        <Route path="/admin-mobile/orders" element={<AdminMobileOrdersPage />} />
        <Route
          path="/admin-mobile/orders/:orderId"
          element={<AdminMobileOrderDetailPage />}
        />
        <Route path="/admin-mobile/alerts" element={<AdminMobileAlertsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  useFcmToken();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppShell />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
