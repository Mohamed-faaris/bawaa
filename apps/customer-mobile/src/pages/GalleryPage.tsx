import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  IndianRupee,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import type { Doc } from "@bawaa/convex-db/convex/_generated/dataModel";
import PageTransition from "@/components/PageTransition";

type Product = Doc<"products">;

const GalleryPage = () => {
  const products = useQuery(api.products.list) ?? [];
  const getImageUrl = useAction(api.storage.getImageUrl);
  const activeProducts = products.filter((p) => p.status === "active") as Product[];

  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>({});
  const [selected, setSelected] = useState<Product | null>(null);
  const [detailThumb, setDetailThumb] = useState<string | null>(null);
  const [detailPhotos, setDetailPhotos] = useState<(string | null)[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    const load = async () => {
      try {
        const t = await getImageUrl({ storageId: selected.thumbnail });
        if (!cancelled) setDetailThumb(t ?? null);
      } catch {
        if (!cancelled) setDetailThumb(null);
      }
      const urls = await Promise.all(
        selected.additionalPhotos.map((sid) =>
          getImageUrl({ storageId: sid }).catch(() => null),
        ),
      );
      if (!cancelled) setDetailPhotos(urls);
    };
    setPhotoIndex(0);
    void load();
    return () => { cancelled = true; };
  }, [selected, getImageUrl]);

  const loadThumbnail = async (productId: string, storageId: string) => {
    if (thumbnails[productId] !== undefined) return;
    try {
      const url = await getImageUrl({ storageId });
      setThumbnails((prev) => ({ ...prev, [productId]: url ?? null }));
    } catch {
      setThumbnails((prev) => ({ ...prev, [productId]: null }));
    }
  };

  const allImages = [detailThumb, ...detailPhotos].filter(Boolean) as string[];

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
              onClick={() => setSelected(product)}
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

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-background rounded-t-3xl max-h-[85vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-background z-10 flex items-center justify-between p-4 pb-2">
                  <p className="text-sm font-semibold text-foreground truncate mr-2">
                    {selected.title}
                  </p>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 rounded-full bg-secondary shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                {allImages.length > 0 && (
                  <div className="relative px-4">
                    <div className="aspect-video rounded-2xl bg-secondary overflow-hidden">
                      <img
                        src={allImages[photoIndex]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setPhotoIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))}
                          className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() => setPhotoIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))}
                          className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <div className="flex justify-center gap-1.5 mt-2">
                          {allImages.map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i === photoIndex ? "bg-primary" : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="p-4 pt-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-2xl font-extrabold text-foreground">
                    <IndianRupee size={20} />
                    {selected.price}
                  </div>

                  {selected.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selected.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                    <Package size={13} />
                    <span>Added {new Date(selected.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default GalleryPage;
