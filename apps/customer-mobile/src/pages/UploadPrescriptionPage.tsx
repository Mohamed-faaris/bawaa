import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import { Textarea } from "@bawaa/ui/textarea";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const profiles = [
  { initials: "RK", name: "Rajesh", color: "bg-primary" },
  { initials: "PK", name: "Priya", color: "bg-accent" },
  { initials: "AK", name: "Arjun", color: "bg-muted-foreground" },
];

const UploadPrescriptionPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = () => {
    toast.success("Prescription uploaded successfully!", {
      description: `For ${profiles[selectedProfile].name}. We'll review shortly.`,
    });
    setFile(null);
    setPreview(null);
    setNotes("");
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Upload Prescription</h1>
        <p className="text-sm text-muted-foreground mb-6">Upload a prescription to place an order</p>

        {/* Profile selector */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">For whom?</p>
          <div className="flex gap-2">
            {profiles.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelectedProfile(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  selectedProfile === i
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <span className={`w-6 h-6 rounded-full ${p.color} flex items-center justify-center text-[10px] font-bold text-primary-foreground`}>
                  {p.initials}
                </span>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Upload area */}
        {!preview ? (
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-3 py-14 cursor-pointer rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors bg-card"
          >
            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-sm">Tap to upload prescription</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF up to 10MB</p>
            </div>
          </motion.label>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden border border-border"
          >
            <img src={preview} alt="Prescription" className="w-full h-56 object-cover" />
            <button
              onClick={() => { setFile(null); setPreview(null); }}
              className="absolute top-3 right-3 w-8 h-8 bg-foreground/70 rounded-full flex items-center justify-center"
            >
              <X size={16} className="text-background" />
            </button>
          </motion.div>
        )}

        {/* Notes */}
        <div className="mt-6 space-y-2">
          <label className="text-sm font-semibold text-foreground">Notes (optional)</label>
          <Textarea
            placeholder="e.g., Monthly refill, need 30-day supply..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-xl bg-card border-border min-h-[100px] resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!file}
          className="w-full h-13 rounded-xl text-base font-semibold mt-6 gap-2"
        >
          <Upload size={18} /> Upload Prescription
        </Button>
      </div>
    </PageTransition>
  );
};

export default UploadPrescriptionPage;
