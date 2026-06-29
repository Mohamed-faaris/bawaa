import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ImageIcon,
  Pencil,
  Trash2,
  IndianRupee,
} from "lucide-react";
import { Button } from "@bawaa/ui/button";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { useAdminProducts } from "@/hooks/useAdminProducts";

const statusConfig = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-warning/15 text-warning border-warning/20" },
  archived: { label: "Archived", className: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/20" },
};

const AdminMobileProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, removeProduct, getImageUrl } = useAdminProducts();
  const product = products.find((p) => p._id === productId);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [additionalUrls, setAdditionalUrls] = useState<(string | null)[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!product) return;
    let cancelled = false;

    const loadImages = async () => {
      try {
        const thumb = await getImageUrl({ storageId: product.thumbnail });
        if (!cancelled) setThumbnailUrl(thumb ?? null);
      } catch {
        if (!cancelled) setThumbnailUrl(null);
      }

      const urls = await Promise.all(
        product.additionalPhotos.map((sid) =>
          getImageUrl({ storageId: sid }).catch(() => null),
        ),
      );
      if (!cancelled) setAdditionalUrls(urls);
    };

    void loadImages();
    return () => { cancelled = true; };
  }, [product, getImageUrl]);

  if (!product) {
    return (
      <PageTransition>
        <div className="app-container screen-padding text-center pt-20">
          <p className="text-muted-foreground">Product not found</p>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin-mobile/products")}
            className="mt-4"
          >
            Go back
          </Button>
        </div>
      </PageTransition>
    );
  }

  const handleDelete = async () => {
    try {
      await removeProduct(product._id);
      toast.success("Product deleted");
      navigate("/admin-mobile/products");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const expiryDate = product.autoDeleteAfter
    ? new Date(product.autoDeleteAfter).toLocaleDateString()
    : null;

  return (
    <PageTransition>
      <div className="app-container screen-padding">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/admin-mobile/products")}
            className="p-1.5 rounded-lg bg-secondary text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-foreground truncate">
              {product.title}
            </h1>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/admin-mobile/products/${product._id}/edit`)}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg bg-secondary text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {thumbnailUrl && (
          <div className="glass-card p-4 mb-3 overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={product.title}
              className="w-full aspect-video object-cover rounded-lg border border-border"
            />
          </div>
        )}

        <div className="glass-card p-4 mb-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">{product.title}</h2>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusConfig[product.status].className}`}>
              {statusConfig[product.status].label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xl font-extrabold text-foreground">
            <IndianRupee size={18} />
            {product.price}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground">{product.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <div>
              <span className="font-semibold">Created</span>
              <p>{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-semibold">Updated</span>
              <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
            {expiryDate && (
              <div>
                <span className="font-semibold">Auto-deletes</span>
                <p>{expiryDate}</p>
              </div>
            )}
          </div>
        </div>

        {additionalUrls.length > 0 && (
          <div className="glass-card p-4 mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Additional Photos ({additionalUrls.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {additionalUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl bg-secondary overflow-hidden">
                  {url ? (
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={18} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 mb-3 border-destructive/30"
          >
            <p className="text-sm font-semibold text-foreground mb-1">Delete this product?</p>
            <p className="text-xs text-muted-foreground mb-3">This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleDelete()}
                className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminMobileProductDetailPage;
