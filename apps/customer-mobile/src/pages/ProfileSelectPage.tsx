import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, User } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

const ProfileSelectPage = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState<Id<"accounts"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const profiles = useQuery(api.profiles.list, {
    accountId: accountId ?? null,
  });

  const createProfile = useMutation(api.profiles.create);

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    if (storedAccountId) {
      setAccountId(storedAccountId as Id<"accounts">);
    }
  }, []);

  const handleSelectProfile = (profileId: string) => {
    localStorage.setItem("profileId", profileId);
    navigate("/home");
  };

  const handleCreateProfile = async () => {
    if (!accountId || isCreating) return;

    setIsCreating(true);
    try {
      const result = await createProfile({
        accountId,
        name: "My Profile",
      });
      if (result.profileId) {
        handleSelectProfile(result.profileId);
      }
    } catch (error) {
      console.error("Failed to create profile:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="app-container min-h-screen flex flex-col bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-8"
      >
        <h1 className="text-2xl font-extrabold text-foreground">
          Who's ordering?
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a profile to continue
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {profiles?.map(
          (profile: { _id: Id<"profiles">; name: string }, i: number) => (
            <motion.button
              key={profile._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleSelectProfile(profile._id)}
              className="glass-card p-5 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {getInitials(profile.name)}
                </span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">
                  {profile.name}
                </p>
                <p className="text-xs text-muted-foreground">Self</p>
              </div>
            </motion.button>
          ),
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          onClick={handleCreateProfile}
          disabled={isCreating}
          className="glass-card p-5 flex flex-col items-center gap-3 border-dashed hover:border-primary/40 transition-colors disabled:opacity-50"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Plus size={24} className="text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-muted-foreground text-sm">
              {isCreating ? "Creating..." : "Add Profile"}
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileSelectPage;
