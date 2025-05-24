
import { getProductBySlug } from "@/services/ProductService";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { productSlug: string } }): Promise<Metadata> {
  const response = await getProductBySlug(params.productSlug);
  const product = response.result;

  return {
    title: `${product.name} | Điện máy V Share`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Điện máy V Share`,
      description: product.description,
      images: [product.images && product.images.length > 0 ? product.images[0] : '/logo.jpg'],
    },
  };
}

export default function LayoutForMetadata({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}