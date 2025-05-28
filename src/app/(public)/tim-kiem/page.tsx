import { Metadata } from "next";
import SearchProduct from "./SearchProduct";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Tìm kiếm sản phẩm | Điện máy V Share`,
    description: '',
    openGraph: {
      title: `Tìm kiếm sản phẩm | Điện máy V Share`,
      description: '',
      images: 'logo.jpg',
    },
  };
}

export default function SearchPage({ params }: { params: { keyword: string } }) {
    return <SearchProduct params={{
      keyword: undefined
  }} />;
}
