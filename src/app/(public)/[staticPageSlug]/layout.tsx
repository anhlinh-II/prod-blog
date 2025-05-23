
import { getStaticPageBySlug } from "@/services/StaticPageService";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { staticPageSlug: string } }): Promise<Metadata> {
  const response = await getStaticPageBySlug(params.staticPageSlug);
  const page = response.result;

  return {
    title: `${page.title} | Điện máy V Share`,
    description: page.content,
    openGraph: {
      title: `${page.title} | Điện máy V Share`,
      description: page.content,
      images: [page.images && page.images.length > 0 ? page.images[0] : 'logo.jpg'],
    },
  };
}

export default function LayoutForMetadata({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}