import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, IndianRupee, Package } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import type { Doc } from "@bawaa/convex-db/convex/_generated/dataModel";
import PageTransition from "@/components/PageTransition";

type Product = Doc<"products">;

const GalleryPage = () => {
  const navigate = useNavigate();
  const products = useQuery(api.products.list) ?? [];
  const getImageUrl = useAction(api.storage.getImageUrl);
  const activeProducts = products.filter((p) => p.status === "active") as Product[];

  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>({});

  const loadThumbnail = async (productId: string, storageId: string) => {
    if (thumbnails[productId] !== undefined) return;
    try {
      const url = await getImageUrl({ storageId });
      setThumbnails((prev) => ({ ...prev, [productId]: url ?? null }));
    } catch {
      setThumbnails((prev) => ({ ...prev, [productId]: null }));
    }
  };

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Gallery</h1>
            <p className="text-sm text-muted-foreground">
              {activeProducts.length} products available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeProducts.map((product, i) => (
            <motion.button
              key={product._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/gallery/${product._id}`)}
              className="glass-card overflow-hidden text-left w-full"
            >
              <div className="aspect-square bg-secondary relative overflow-hidden">
                {(() => {
                  void loadThumbnail(product._id, product.thumbnail);
                  return thumbnails[product._id] ? (
                    <img
                      src={thumbnails[product._id]!}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={28} className="text-muted-foreground/40" />
                    </div>
                  );
                })()}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground truncate">
                  {product.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-0.5">
                  <IndianRupee size={11} />
                  {product.price}
                </p>
              </div>
            </motion.button>
          ))}
          {activeProducts.length === 0 && (
            <div className="col-span-2 glass-card p-8 text-center">
              <Package size={36} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No products available yet.</p>
            </div>
          )}
        </div>


      </div>
    </PageTransition>
  );
};

export default GalleryPage;
