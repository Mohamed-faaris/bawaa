import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, User } from "lucide-react";

const mockProfiles = [
  { id: "1", name: "Rajesh Kumar", relation: "Self", avatar: "R" },
  { id: "2", name: "Priya Kumar", relation: "Wife", avatar: "P" },
  { id: "3", name: "Aarav Kumar", relation: "Son", avatar: "A" },
];

const ProfileSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container min-h-screen flex flex-col bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-8"
      >
        <h1 className="text-2xl font-extrabold text-foreground">Who's ordering?</h1>
        <p className="text-muted-foreground mt-1">Select a profile to continue</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {mockProfiles.map((profile, i) => (
          <motion.button
            key={profile.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate("/home")}
            className="glass-card p-5 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{profile.avatar}</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-sm">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.relation}</p>
            </div>
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5 flex flex-col items-center gap-3 border-dashed hover:border-primary/40 transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Plus size={24} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-muted-foreground text-sm">Add Profile</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileSelectPage;
