import { useState } from "react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@bawaa/ui/drawer";
import { useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { toast } from "@bawaa/ui/use-toast";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

interface AddProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  accountId: Id<"accounts"> | null;
}

export function AddProfileDrawer({
  open,
  onClose,
  accountId,
}: AddProfileDrawerProps) {
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

  const handleClose = () => {
    setName("");
    setAge("");
    onClose();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
      direction="bottom"
    >
      <DrawerContent>
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
}
