import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { Toaster } from "@bawaa/ui/toaster";
import { Toaster as Sonner } from "@bawaa/ui/sonner";
import { TooltipProvider } from "@bawaa/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminPanelLayout from "@/components/AdminPanelLayout";

import PanelDashboardPage from "@/pages/PanelDashboardPage";
import PanelOrdersPage from "@/pages/PanelOrdersPage";
import PanelPrescriptionsPage from "@/pages/PanelPrescriptionsPage";
import PanelDeliveriesPage from "@/pages/PanelDeliveriesPage";
import PanelDeliveryDetailPage from "@/pages/PanelDeliveryDetailPage";
import PanelUsersPage from "@/pages/PanelUsersPage";
import PanelUserDetailPage from "@/pages/PanelUserDetailPage";
import PanelAnalyticsPage from "@/pages/PanelAnalyticsPage";
import PanelSettingsPage from "@/pages/PanelSettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-destructive mb-2">
        Access Denied
      </h1>
      <p className="text-muted-foreground">Invalid admin secret</p>
    </div>
  </div>
);

const App = () => {
  const verifyResult = useQuery(
    api.admin.verifySecret,
    ADMIN_SECRET ? { secret: ADMIN_SECRET } : "skip",
  );

  const isAuthorized = verifyResult?.valid === true;

  if (verifyResult === undefined) {
    return null;
  }

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/panel" replace />} />
            <Route element={<AdminPanelLayout />}>
              <Route path="/panel" element={<PanelDashboardPage />} />
              <Route path="/panel/orders" element={<PanelOrdersPage />} />
              <Route
                path="/panel/prescriptions"
                element={<PanelPrescriptionsPage />}
              />
              <Route
                path="/panel/deliveries"
                element={<PanelDeliveriesPage />}
              />
              <Route
                path="/panel/deliveries/:staffId"
                element={<PanelDeliveryDetailPage />}
              />
              <Route path="/panel/users" element={<PanelUsersPage />} />
              <Route
                path="/panel/users/:userId"
                element={<PanelUserDetailPage />}
              />
              <Route path="/panel/analytics" element={<PanelAnalyticsPage />} />
              <Route path="/panel/settings" element={<PanelSettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
