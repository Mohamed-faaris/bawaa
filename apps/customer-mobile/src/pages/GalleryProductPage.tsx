import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  IndianRupee,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import PageTransition from "@/components/PageTransition";

const GalleryProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = useQuery(api.products.get, { productId: productId as any });
  const getImageUrl = useAction(api.storage.getImageUrl);

  const [images, setImages] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    const load = async () => {
      const urls: string[] = [];
      try {
        const t = await getImageUrl({ storageId: product.thumbnail });
        if (t) urls.push(t);
      } catch {}
      const additional = await Promise.all(
        product.additionalPhotos.map((sid) =>
          getImageUrl({ storageId: sid }).catch(() => null),
        ),
      );
      urls.push(...additional.filter(Boolean) as string[]);
      if (!cancelled) setImages(urls);
    };
    setPhotoIndex(0);
    void load();
    return () => { cancelled = true; };
  }, [product, getImageUrl]);

  if (!product) {
    return (
      <PageTransition>
        <div className="app-container screen-padding text-center pt-20">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="app-container screen-padding pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/gallery")}
            className="p-1.5 rounded-lg bg-secondary text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm font-semibold text-foreground truncate">
            {product.title}
          </p>
        </div>

        {images.length > 0 && (
          <div className="relative mb-4">
            <div className="aspect-square rounded-2xl bg-secondary overflow-hidden">
              <img
                src={images[photoIndex]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPhotoIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="flex justify-center gap-1.5 mt-3">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === photoIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-2xl font-extrabold text-foreground">
            <IndianRupee size={22} />
            {product.price}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
            <Package size={14} />
            <span>Added {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GalleryProductPage;
