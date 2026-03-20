import { Toaster } from "@bawaa/ui/toaster";
import { Toaster as Sonner } from "@bawaa/ui/sonner";
import { TooltipProvider } from "@bawaa/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import DeliveryBottomNav from "@/components/DeliveryBottomNav";

import DeliveryLoginPage from "@/pages/DeliveryLoginPage";
import DeliveryQueuePage from "@/pages/DeliveryQueuePage";
import MyDeliveriesPage from "@/pages/MyDeliveriesPage";
import DeliveryRoutesPage from "@/pages/DeliveryRoutesPage";
import DeliveryProfilePage from "@/pages/DeliveryProfilePage";
import DeliveryOrderDetailPage from "@/pages/DeliveryOrderDetailPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const NavigationBars = () => {
  const location = useLocation();
  const path = location.pathname;

  const isDeliveryApp = path.startsWith("/delivery") && path !== "/delivery/login";

  return isDeliveryApp ? <DeliveryBottomNav /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationBars />
        <Routes>
          <Route path="/delivery/login" element={<DeliveryLoginPage />} />
          <Route path="/delivery" element={<DeliveryQueuePage />} />
          <Route path="/delivery/my-deliveries" element={<MyDeliveriesPage />} />
          <Route path="/delivery/routes" element={<DeliveryRoutesPage />} />
          <Route path="/delivery/profile" element={<DeliveryProfilePage />} />
          <Route path="/delivery/order/:orderId" element={<DeliveryOrderDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
