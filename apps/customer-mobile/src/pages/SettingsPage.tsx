import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Phone, ChevronRight, LogOut, Users, Bell, HelpCircle, Edit3, X, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/PageTransition";
import { Input } from "@bawaa/ui/input";
import { Button } from "@bawaa/ui/button";
import { toast } from "@bawaa/ui/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { accountId, logout } = useAuth();

  const account = useQuery(api.auth.getAccount, { accountId });
  const profiles = useQuery(api.profiles.list, { accountId });
  const updateAccount = useMutation(api.auth.updateAccount);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleEdit = () => {
    if (!account) return;
    setEditName(account.name || "");
    setEditAddress(account.address || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!accountId || !editName.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await updateAccount({
        accountId,
        name: editName.trim(),
        address: editAddress.trim() || undefined,
      });
      toast({ title: "Profile updated" });
      setEditing(false);
    } catch {
      toast({ title: "Error", description: "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = account ? getInitials(account.name) : "?";

  const menuItems = [
    { icon: User, label: "Account Details", subtitle: account?.phone ? `+91 ${account.phone}` : "", onClick: handleEdit },
    { icon: MapPin, label: "Delivery Address", subtitle: account?.address || "Not set", onClick: handleEdit },
    { icon: Users, label: "Manage Profiles", subtitle: profiles ? `${profiles.length} profile${profiles.length !== 1 ? "s" : ""}` : "...", onClick: () => navigate("/profiles") },
    { icon: Bell, label: "Notifications", subtitle: "Enabled" },
    { icon: HelpCircle, label: "Help & Support", subtitle: "FAQs, contact us", onClick: () => navigate("/help") },
  ];

  if (editing) {
    return (
      <PageTransition>
        <div className="app-container screen-padding">
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="font-bold text-foreground text-lg">Edit Profile</h2>
            <button onClick={() => setEditing(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 space-y-5"
          >
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">{initials}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Address</label>
              <Input
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Delivery address"
                className="rounded-xl"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!editName.trim() || isSaving}
              className="w-full h-12 rounded-xl gap-2"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Check size={18} />
              )}
              Save Changes
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center justify-between mb-2 mt-2">
          <h2 className="font-bold text-foreground text-lg">Settings</h2>
          <button
            onClick={handleEdit}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Edit3 size={18} className="text-muted-foreground" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-foreground text-lg">{account?.name || "Loading..."}</h2>
            <p className="text-sm text-muted-foreground">Personal Account</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card overflow-hidden divide-y divide-border mb-6"
        >
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-destructive/20 text-destructive font-semibold text-sm hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={18} /> Log Out
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default SettingsPage;
