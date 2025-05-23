
import { getNewsBySlug } from "@/services/NewsService";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { newsSlug: string } }): Promise<Metadata> {
  const response = await getNewsBySlug(params.newsSlug);
  const news = response.result;

  return {
    title: `${news.title} | Điện máy V Share`,
    description: news.content,
    openGraph: {
      title: `${news.title} | Điện máy V Share`,
      description: news.content,
      images: [news.images && news.images.length > 0 ? news.images[0] : 'logo.jpg'],
    },
  };
}

export default function LayoutForMetadata({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}