
import { getNewsBySlug } from "@/services/NewsService";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { newsSlug: string } }): Promise<Metadata> {
  const response = await getNewsBySlug(params.newsSlug);
  
  if(response && response.code == 1000) {
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

  } else {
    notFound();
  }
}

export default function LayoutForMetadata({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}