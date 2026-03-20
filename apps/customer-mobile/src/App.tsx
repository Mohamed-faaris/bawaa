import { Toaster } from "@bawaa/ui/toaster";
import { Toaster as Sonner } from "@bawaa/ui/sonner";
import { TooltipProvider } from "@bawaa/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import BottomNav from "@/components/BottomNav";

import AppSwitcher from "@/pages/AppSwitcher";
import LoginPage from "@/pages/LoginPage";
import ProfileSelectPage from "@/pages/ProfileSelectPage";
import HomePage from "@/pages/HomePage";
import UploadPrescriptionPage from "@/pages/UploadPrescriptionPage";
import OrdersPage from "@/pages/OrdersPage";
import PrescriptionHistoryPage from "@/pages/PrescriptionHistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const NavigationBars = () => {
  const location = useLocation();
  const path = location.pathname;

  const isCustomerApp = ["/home", "/upload", "/orders", "/history", "/settings", "/profiles"].includes(path);

  return isCustomerApp ? <BottomNav /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationBars />
        <Routes>
          <Route path="/" element={<AppSwitcher />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profiles" element={<ProfileSelectPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/upload" element={<UploadPrescriptionPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/history" element={<PrescriptionHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
