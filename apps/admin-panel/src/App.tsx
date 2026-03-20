import { Toaster } from "@bawaa/ui/toaster";
import { Toaster as Sonner } from "@bawaa/ui/sonner";
import { TooltipProvider } from "@bawaa/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AdminPanelLayout />}>
            <Route path="/panel" element={<PanelDashboardPage />} />
            <Route path="/panel/orders" element={<PanelOrdersPage />} />
            <Route path="/panel/prescriptions" element={<PanelPrescriptionsPage />} />
            <Route path="/panel/deliveries" element={<PanelDeliveriesPage />} />
            <Route path="/panel/deliveries/:staffId" element={<PanelDeliveryDetailPage />} />
            <Route path="/panel/users" element={<PanelUsersPage />} />
            <Route path="/panel/users/:userId" element={<PanelUserDetailPage />} />
            <Route path="/panel/analytics" element={<PanelAnalyticsPage />} />
            <Route path="/panel/settings" element={<PanelSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
