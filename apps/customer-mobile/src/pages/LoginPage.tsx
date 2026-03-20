import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Shield } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep("otp");
  };

  const handleVerify = () => {
    if (otp.length >= 4) navigate("/profiles");
  };

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      {/* Header area */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6">
            <span className="text-primary-foreground text-2xl font-extrabold">B</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Bavaa Medicals
          </h1>
          <p className="text-muted-foreground text-base">
            Your trusted pharmacy, delivered to your door.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-4"
        >
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-11 h-13 text-base rounded-xl bg-card border-border"
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={phone.length < 10}
                className="w-full h-13 rounded-xl text-base font-semibold gap-2"
              >
                Send OTP <ArrowRight size={18} />
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Enter OTP</label>
                <p className="text-sm text-muted-foreground">
                  Code sent to +91 {phone}
                </p>
                <Input
                  type="number"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  className="h-13 text-center text-xl tracking-[0.5em] font-bold rounded-xl bg-card border-border"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={otp.length < 4}
                className="w-full h-13 rounded-xl text-base font-semibold gap-2"
              >
                Verify & Continue <Shield size={18} />
              </Button>
              <button
                onClick={() => setStep("phone")}
                className="text-sm text-primary font-medium w-full text-center"
              >
                Change phone number
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
