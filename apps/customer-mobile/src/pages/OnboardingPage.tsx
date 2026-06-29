import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@bawaa/ui/use-toast";
import AddressPicker from "@/components/AddressPicker";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { accountId } = useAuth();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateAccount = useMutation(api.auth.updateAccount);

  const handleSubmit = async () => {
    if (!accountId || !name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateAccount({
        accountId,
        name: name.trim(),
        address: address.trim() || undefined,
      });
      toast({ title: "Welcome to Bawaa Medicals!" });
      navigate("/home", { replace: true });
    } catch {
      toast({ title: "Error", description: "Failed to save details" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-10"
        >
          <img
            src="/bawaa_logo.png"
            alt="Bawaa Medicals Logo"
            className="w-20 h-20 rounded-2xl object-contain mb-6"
          />
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Complete your profile
          </h1>
          <p className="text-muted-foreground text-base">
            Tell us a bit about yourself to get started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Your Name *
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-13 text-base rounded-xl bg-card border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Delivery Address
            </label>
            <AddressPicker value={address} onChange={setAddress} />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="w-full h-13 rounded-xl text-base font-semibold gap-2 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Get Started"
            )}{" "}
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;
