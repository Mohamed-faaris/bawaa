import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ImageIcon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { Input } from "@bawaa/ui/input";

const statusConfig = {
  active: { label: "Active", className: "bg-success/15 text-success" },
  inactive: { label: "Inactive", className: "bg-warning/15 text-warning" },
  archived: { label: "Archived", className: "bg-muted-foreground/15 text-muted-foreground" },
};

const AdminMobileProductsPage = () => {
  const navigate = useNavigate();
  const { products, getImageUrl } = useAdminProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [thumbnails, setThumbnails] = useState<Record<string, string | null>>({});

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleThumbnailLoad = async (productId: string, storageId: string) => {
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">{products.length} total</p>
          </div>
          <button
            onClick={() => navigate("/admin-mobile/products/new")}
            className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9 h-10 rounded-xl bg-card border-border text-sm"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((product, i) => (
            <motion.button
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/admin-mobile/products/${product._id}`)}
              className="glass-card p-3 flex items-start gap-3 w-full text-left"
            >
              <div className="w-16 h-16 rounded-xl bg-secondary shrink-0 overflow-hidden flex items-center justify-center">
                {(() => {
                  void handleThumbnailLoad(product._id, product.thumbnail);
                  return thumbnails[product._id] ? (
                    <img
                      src={thumbnails[product._id]!}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={20} className="text-muted-foreground" />
                  );
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{product.title}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${statusConfig[product.status].className}`}>
                    {statusConfig[product.status].label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  ₹{product.price}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No products match your search." : "No products yet."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/admin-mobile/products/new")}
                  className="mt-3 text-sm font-semibold text-accent"
                >
                  Add your first product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileProductsPage;
