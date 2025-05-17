'use client';
import CategoryPage from "../CategoryPage";


interface PageProps {
  params: { categorySlug?: string };
}

export default function DanhMucDetailPage({ params }: PageProps) {
  return <CategoryPage params={params} />;
}
