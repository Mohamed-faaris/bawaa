import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, ArrowRight, User } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";

const DeliveryLoginPage = () => {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    if (staffId && pin.length >= 4) navigate("/delivery");
  };

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-info flex items-center justify-center mb-6">
            <Truck className="text-info-foreground" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Bavaa Delivery
          </h1>
          <p className="text-muted-foreground text-base">
            Delivery staff portal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Staff ID</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter your staff ID"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="pl-11 h-13 text-base rounded-xl bg-card border-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">PIN</label>
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              className="h-13 text-base rounded-xl bg-card border-border"
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={!staffId || pin.length < 4}
            className="w-full h-13 rounded-xl text-base font-semibold gap-2 bg-info hover:bg-info/90"
          >
            Start Delivering <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryLoginPage;
