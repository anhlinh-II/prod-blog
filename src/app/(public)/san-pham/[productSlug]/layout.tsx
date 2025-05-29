
import { getProductBySlug } from "@/services/ProductService";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { productSlug: string } }): Promise<Metadata> {
  const response = await getProductBySlug(params.productSlug);
  
  if(response && response.code == 1000) {
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
  
  } else {
    notFound();
  }
}

export default function LayoutForMetadata({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}