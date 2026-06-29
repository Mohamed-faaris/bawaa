import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, Plus, Trash2, Save, X } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { Button } from "@bawaa/ui/button";
import { Input } from "@bawaa/ui/input";
import { Textarea } from "@bawaa/ui/textarea";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { useAdminProducts, type ProductStatus } from "@/hooks/useAdminProducts";

const AdminMobileProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!productId;

  const existingProduct = useQuery(api.products.get, productId ? { productId: productId as any } : "skip");
  const { createProduct, updateProduct, generateUploadUrl } = useAdminProducts();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProductStatus>("active");
  const [autoDeleteDays, setAutoDeleteDays] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailStorageId, setThumbnailStorageId] = useState<string | null>(null);

  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [additionalStorageIds, setAdditionalStorageIds] = useState<string[]>([]);

  useEffect(() => {
    if (!existingProduct) return;
    setTitle(existingProduct.title);
    setPrice(String(existingProduct.price));
    setDescription(existingProduct.description ?? "");
    setStatus(existingProduct.status);
    setAutoDeleteDays(
      existingProduct.autoDeleteAfter
        ? String(Math.round((existingProduct.autoDeleteAfter - Date.now()) / 86400000))
        : "",
    );
  }, [existingProduct]);

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAdditionalSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setAdditionalFiles((prev) => [...prev, ...files]);
    setAdditionalPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeAdditional = (index: number) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
    setAdditionalPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setAdditionalStorageIds((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) throw new Error("Upload failed");
    const { storageId } = (await response.json()) as { storageId: string };
    return storageId;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      toast.error("Valid price is required");
      return;
    }

    setIsSaving(true);
    try {
      let thumbnail = thumbnailStorageId;
      let additional = additionalStorageIds;

      if (thumbnailFile && !thumbnailStorageId) {
        setIsUploading(true);
        thumbnail = await uploadFile(thumbnailFile);
        setIsUploading(false);
      }

      if (additionalFiles.length > additionalStorageIds.length) {
        setIsUploading(true);
        const newFiles = additionalFiles.slice(additionalStorageIds.length);
        const newIds = await Promise.all(newFiles.map((f) => uploadFile(f)));
        additional = [...additionalStorageIds, ...newIds];
        setIsUploading(false);
      }

      const autoDeleteAfter = autoDeleteDays
        ? Date.now() + Number(autoDeleteDays) * 86400000
        : undefined;

      if (isEditing && existingProduct) {
        await updateProduct({
          productId: existingProduct._id,
          thumbnail: thumbnail ?? undefined,
          title: title.trim(),
          additionalPhotos: additional.length ? additional : undefined,
          price: Number(price),
          description: description.trim() || undefined,
          status,
          autoDeleteAfter,
        });
        toast.success("Product updated");
      } else {
        await createProduct({
          thumbnail: thumbnail!,
          title: title.trim(),
          additionalPhotos: additional,
          price: Number(price),
          description: description.trim() || undefined,
          status,
          autoDeleteAfter,
        });
        toast.success("Product created");
      }
      navigate("/admin-mobile/products");
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Failed to update product" : "Failed to create product");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

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
          <h1 className="text-lg font-extrabold text-foreground">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Thumbnail *
            </p>
            <label className="block w-full aspect-video rounded-xl border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <ImageIcon size={28} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Tap to upload</p>
                </div>
              )}
            </label>
          </div>

          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Additional Photos
            </p>
            <div className="grid grid-cols-3 gap-2">
              {additionalPreviews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-xl bg-secondary overflow-hidden group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeAdditional(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalSelect}
                  className="hidden"
                />
                <Plus size={20} className="text-muted-foreground" />
              </label>
            </div>
          </div>

          <div className="glass-card p-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
                className="h-10 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Price (₹)</label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                type="number"
                min="0"
                step="0.01"
                className="h-10 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                className="rounded-xl bg-card border-border min-h-[96px] resize-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Status</label>
              <div className="flex gap-2">
                {(["active", "inactive", "archived"] as ProductStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      status === s
                        ? s === "active"
                          ? "bg-success/15 text-success"
                          : s === "inactive"
                            ? "bg-warning/15 text-warning"
                            : "bg-muted-foreground/15 text-muted-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Auto-delete after (days)
              </label>
              <Input
                value={autoDeleteDays}
                onChange={(e) => setAutoDeleteDays(e.target.value)}
                placeholder="Leave empty for no auto-delete"
                type="number"
                min="1"
                className="h-10 rounded-xl text-sm"
              />
            </div>
          </div>

          <Button
            onClick={() => void handleSave()}
            disabled={isSaving || isUploading}
            className="w-full rounded-xl h-12 gap-2 text-sm font-semibold"
          >
            {isUploading ? (
              "Uploading images..."
            ) : isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} />
                {isEditing ? "Update Product" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminMobileProductFormPage;
