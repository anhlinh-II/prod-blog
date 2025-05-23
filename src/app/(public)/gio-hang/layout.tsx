
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Giỏ hàng | Điện máy V Share`,
    description: '',
    openGraph: {
      title: `Giỏ hàng | Điện máy V Share`,
      description: '',
      images: 'logo.jpg',
    },
  };
}


export default function LayoutForMetadata({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}