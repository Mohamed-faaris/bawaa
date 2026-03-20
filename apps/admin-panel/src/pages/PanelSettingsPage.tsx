import AdminPanelLayout from "@/components/AdminPanelLayout";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { toast } from "sonner";

const PanelSettingsPage = () => {
  return (
    <AdminPanelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Business and system configuration</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Business Info */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Business Information</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Business Name</label>
              <Input defaultValue="Bavaa Medicals" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input defaultValue="+91 44 2345 6789" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input defaultValue="123, Main Street, Chennai, TN 600001" className="rounded-lg" />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Operating Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Opening Time</label>
              <Input type="time" defaultValue="08:00" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Closing Time</label>
              <Input type="time" defaultValue="22:00" className="rounded-lg" />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Delivery Settings</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Max Delivery Range (km)</label>
              <Input type="number" defaultValue="15" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Delivery Fee (₹)</label>
              <Input type="number" defaultValue="50" className="rounded-lg" />
            </div>
          </div>
        </div>

        <Button onClick={() => toast.success("Settings saved!")} className="w-full rounded-lg">
          Save Changes
        </Button>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelSettingsPage;
