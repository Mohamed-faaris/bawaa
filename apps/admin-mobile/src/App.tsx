import { Toaster } from "@bawaa/ui/toaster";
import { Toaster as Sonner } from "@bawaa/ui/sonner";
import { TooltipProvider } from "@bawaa/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import AdminMobileBottomNav from "@/components/AdminMobileBottomNav";

import AdminMobileLoginPage from "@/pages/AdminMobileLoginPage";
import AdminMobileDashboardPage from "@/pages/AdminMobileDashboardPage";
import AdminMobileOrdersPage from "@/pages/AdminMobileOrdersPage";
import AdminMobileOrderDetailPage from "@/pages/AdminMobileOrderDetailPage";
import AdminMobileAlertsPage from "@/pages/AdminMobileAlertsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const NavigationBars = () => {
  const location = useLocation();
  const path = location.pathname;

  const isAdminMobile = path.startsWith("/admin-mobile") && path !== "/admin-mobile/login";

  return isAdminMobile ? <AdminMobileBottomNav /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationBars />
        <Routes>
          <Route path="/admin-mobile/login" element={<AdminMobileLoginPage />} />
          <Route path="/admin-mobile" element={<AdminMobileDashboardPage />} />
          <Route path="/admin-mobile/orders" element={<AdminMobileOrdersPage />} />
          <Route path="/admin-mobile/orders/:orderId" element={<AdminMobileOrderDetailPage />} />
          <Route path="/admin-mobile/alerts" element={<AdminMobileAlertsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
