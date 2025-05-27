import { Metadata } from "next";
import SearchProduct from "../SearchProduct";

export async function generateMetadata({ params }: { params: { keyword: string } }): Promise<Metadata> {
  return {
    title: `Bạn đã tìm ${decodeURIComponent(params.keyword)} | Điện máy V Share`,
    description: '',
    openGraph: {
      title: `Bạn đã tìm ${decodeURIComponent(params.keyword)} | Điện máy V Share`,
      description: '',
      images: 'logo.jpg',
    },
  };
}

export default function SearchPage({ params }: { params: { keyword: string } }) {
    return <SearchProduct params={params} />;
}
