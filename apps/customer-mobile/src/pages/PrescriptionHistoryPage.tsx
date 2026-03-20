import { motion } from "framer-motion";
import { FileText, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@bawaa/ui/button";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";

const prescriptions = [
  {
    id: "RX-1001",
    date: "Mar 5, 2026",
    doctor: "Dr. Anand Sharma",
    medicines: ["Paracetamol 500mg", "Amoxicillin 250mg", "Vitamin D3"],
    orderedCount: 2,
  },
  {
    id: "RX-0998",
    date: "Feb 20, 2026",
    doctor: "Dr. Meera Patel",
    medicines: ["Metformin 500mg", "Amlodipine 5mg"],
    orderedCount: 4,
  },
  {
    id: "RX-0985",
    date: "Jan 15, 2026",
    doctor: "Dr. Anand Sharma",
    medicines: ["Omeprazole 20mg", "Cetirizine 10mg", "B-Complex"],
    orderedCount: 1,
  },
];

const PrescriptionHistoryPage = () => {
  const handleReorder = (id: string) => {
    toast.success("Reorder initiated!", {
      description: `Prescription ${id} has been added as a new order.`,
    });
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Prescription History</h1>
        <p className="text-sm text-muted-foreground mb-6">
          View past prescriptions and reorder
        </p>

        <div className="space-y-4">
          {prescriptions.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{rx.id}</p>
                    <p className="text-xs text-muted-foreground">{rx.doctor}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> {rx.date}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {rx.medicines.map((med) => (
                  <span key={med} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {med}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Ordered {rx.orderedCount} time{rx.orderedCount > 1 ? "s" : ""}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReorder(rx.id)}
                  className="gap-1.5 rounded-lg text-xs h-8"
                >
                  <RotateCcw size={14} /> Reorder
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default PrescriptionHistoryPage;
