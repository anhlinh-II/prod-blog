import { Container } from "@mui/material";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label?: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  title?: string;
}

export default function Breadcrumb({ items, title }: BreadcrumbProps) {
    
  return (
    <nav className="text-sm text-gray-600 w-full p-4 border-b border-gray-300" aria-label="Breadcrumb">
        <main className="flex-grow">
            <Container maxWidth={"lg"} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-shrink-0">
              {items.map((item, index) => {
                  const isLast = index === items.length - 1;

                  return (
                  <div key={index} className="flex items-center gap-2">
                      {index > 0 && <ChevronRight size={16} />}
                        {item.href && !isLast ? (
                        <Link href={item.href} className="hover:text-red-600 text-gray-600">
                            {item.label}
                        </Link>
                        ) : (
                        <span className="font-medium text-gray-800">{item.label}</span>
                      )}
                  </div>
                  );
              })}
              </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-xl text-red-600">{title}</div>
            </Container>
        </main>
    </nav>
  );
}
