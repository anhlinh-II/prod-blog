
import { Metadata } from "next";
import CategoryPage from "../CategoryPage";
import { getCategoryBySlug } from "@/services/CategoryService";
import { notFound } from "next/navigation";


export async function generateMetadata({ params }: { params: { categorySlug: string } }): Promise<Metadata> {
  const response = await getCategoryBySlug(params.categorySlug);
  
  if(response && response.code == 1000) {
    const category = response.result;

    return {
      title: `${category.name} | Điện máy V Share`,
      description: category.description,
      openGraph: {
        title: `${category.name} | Điện máy V Share`,
        description: category.description,
        images: '/logo.jpg',
      },
    };
    
  } else {
    notFound();
  }
  
}

interface PageProps {
  params: { categorySlug?: string };
}

export default function DanhMucDetailPage({ params }: PageProps) {
  return <CategoryPage params={params} />;
}
