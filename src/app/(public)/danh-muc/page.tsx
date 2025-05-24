
import { Metadata } from "next";
import CategoryPage from "./CategoryPage";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Danh mục sản phẩm | Điện máy V Share`,
    description: '',
    openGraph: {
      title: `Danh mục sản phẩm | Điện máy V Share`,
      description: '',
      images: 'logo.jpg',
    },
  };
}

export default function DanhMucRootPage() {
  return <CategoryPage params={{
      categorySlug: undefined
  }} />;
}
