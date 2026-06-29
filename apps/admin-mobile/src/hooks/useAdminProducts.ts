import { useMutation, useQuery } from "convex/react";
import { useAction } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import type { Doc, Id } from "@bawaa/convex-db/convex/_generated/dataModel";

export type ProductStatus = "active" | "inactive" | "archived";

export type AdminProduct = Doc<"products">;

export function useAdminProducts() {
  const products = useQuery(api.products.list) ?? [];
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const generateUploadUrl = useAction(api.storage.generateUploadUrl);
  const getImageUrl = useAction(api.storage.getImageUrl);

  return {
    products: products as AdminProduct[],
    createProduct: (args: {
      thumbnail: string;
      title: string;
      additionalPhotos: string[];
      price: number;
      description?: string;
      status: ProductStatus;
      autoDeleteAfter?: number;
    }) => createProduct(args),
    updateProduct: (args: {
      productId: Id<"products">;
      thumbnail?: string;
      title?: string;
      additionalPhotos?: string[];
      price?: number;
      description?: string;
      status?: ProductStatus;
      autoDeleteAfter?: number;
    }) => updateProduct(args),
    removeProduct: (productId: Id<"products">) => removeProduct({ productId }),
    generateUploadUrl,
    getImageUrl,
  };
}
