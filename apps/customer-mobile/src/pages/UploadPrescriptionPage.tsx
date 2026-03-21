import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Plus } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { Textarea } from "@bawaa/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@bawaa/ui/drawer";
import { useQuery, useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import PageTransition from "@/components/PageTransition";
import { toast } from "@bawaa/ui/use-toast";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

const ProfileDrawer = ({
  open,
  onClose,
  accountId,
}: {
  open: boolean;
  onClose: () => void;
  accountId: Id<"accounts"> | null;
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createProfile = useMutation(api.profiles.create);

  const handleCreate = async () => {
    if (!accountId || !name.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      const result = await createProfile({
        accountId,
        name: name.trim(),
        age: age ? parseInt(age) : undefined,
      });
      if (result.profileId) {
        toast({ title: "Profile created successfully" });
        setName("");
        setAge("");
        onClose();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create profile" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
      direction="bottom"
    >
      <DrawerContent className="w-screen">
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Profile</DrawerTitle>
          <DrawerDescription>
            Create a profile for yourself or a family member.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Name *
            </label>
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Age (optional)
            </label>
            <Input
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <DrawerFooter className="pt-4">
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="w-full rounded-xl"
          >
            {isCreating ? "Creating..." : "Create Profile"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-xl">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const UploadPrescriptionPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedProfileId, setSelectedProfileId] =
    useState<Id<"profiles"> | null>(null);
  const [accountId, setAccountId] = useState<Id<"accounts"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const profiles = useQuery(api.profiles.list, {
    accountId: accountId ?? null,
  });

  const createOrder = useMutation(api.orders.create);

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    if (storedAccountId) {
      setAccountId(storedAccountId as Id<"accounts">);
    }
  }, []);

  useEffect(() => {
    if (profiles && profiles.length > 0 && !selectedProfileId) {
      const storedProfileId = localStorage.getItem("profileId");
      if (storedProfileId && profiles.some((p) => p._id === storedProfileId)) {
        setSelectedProfileId(storedProfileId as Id<"profiles">);
      } else {
        setSelectedProfileId(profiles[0]._id);
      }
    }
  }, [profiles, selectedProfileId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    if (!selectedProfileId) {
      setIsDrawerOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const prescriptionUrl = preview || undefined;
      await createOrder({
        profileId: selectedProfileId,
        prescription: prescriptionUrl,
      });
      toast({
        title: "Success",
        description: "Prescription uploaded! We'll review shortly.",
      });
      setFile(null);
      setPreview(null);
      setNotes("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload prescription" });
    } finally {
      setIsSubmitting(false);
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

  const getColor = (index: number) => {
    const colors = ["bg-primary", "bg-accent", "bg-muted-foreground"];
    return colors[index % colors.length];
  };

  return (
    <>
      <PageTransition>
        <div className="app-container screen-padding">
          <h1 className="text-xl font-extrabold text-foreground mb-1">
            Upload Prescription
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Upload a prescription to place an order
          </p>

          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">
              For whom?
            </p>
            <div className="flex gap-2 flex-wrap">
              {profiles?.map(
                (profile: { _id: Id<"profiles">; name: string }, i: number) => (
                  <button
                    key={profile._id}
                    onClick={() => setSelectedProfileId(profile._id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      selectedProfileId === profile._id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full ${getColor(i)} flex items-center justify-center text-[10px] font-bold text-primary-foreground`}
                    >
                      {getInitials(profile.name)}
                    </span>
                    {profile.name}
                  </button>
                ),
              )}
              <button
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-border bg-card text-muted-foreground text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Plus size={16} />
                Add Profile
              </button>
            </div>
          </div>

          {selectedProfileId && profiles && (
            <div className="mb-4 px-3 py-2 bg-muted rounded-lg flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Ordering for:
              </span>
              <span className="text-xs font-semibold text-foreground">
                {profiles.find(
                  (p: { _id: Id<"profiles"> }) => p._id === selectedProfileId,
                )?.name || "Unknown"}
              </span>
            </div>
          )}

          {!preview ? (
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-14 cursor-pointer rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors bg-card"
            >
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">
                  Tap to upload prescription
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, PDF up to 10MB
                </p>
              </div>
            </motion.label>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-xl overflow-hidden border border-border"
            >
              <img
                src={preview}
                alt="Prescription"
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-foreground/70 rounded-full flex items-center justify-center"
              >
                <X size={16} className="text-background" />
              </button>
            </motion.div>
          )}

          <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Notes (optional)
            </label>
            <Textarea
              placeholder="e.g., Monthly refill, need 30-day supply..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl bg-card border-border min-h-[100px] resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className="w-full h-13 rounded-xl text-base font-semibold mt-6 gap-2"
          >
            <Upload size={18} />{" "}
            {isSubmitting ? "Uploading..." : "Upload Prescription"}
          </Button>
        </div>
      </PageTransition>

      <ProfileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        accountId={accountId}
      />
    </>
  );
};

export default UploadPrescriptionPage;
