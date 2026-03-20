import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";

const AdminMobileLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="app-container min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6">
            <Shield className="text-accent-foreground" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground text-base">Bavaa Medicals — Quick Dashboard</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Email</label>
            <Input placeholder="admin@bavaa.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-13 rounded-xl bg-card border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Password</label>
            <Input type="password" placeholder="Enter password" value={pass} onChange={(e) => setPass(e.target.value)} className="h-13 rounded-xl bg-card border-border" />
          </div>
          <Button onClick={() => navigate("/admin-mobile")} disabled={!email || !pass} className="w-full h-13 rounded-xl text-base font-semibold gap-2 bg-accent hover:bg-accent/90">
            Login <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMobileLoginPage;
