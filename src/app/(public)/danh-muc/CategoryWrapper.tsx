import { useState, useEffect } from "react";
import CategoryTreeDesktop from "./CategoryTreeDesktop";
import CategoryTreeMobile from "./CategoryTreeMobile";
import { CategoryResponse } from "@/types";

export interface CategoryTreeMenuProps {
  categorySlug?: string;
  setCategory: (category: CategoryResponse) => void;
}

export default function CategoryTreeMenuWrapper(props: CategoryTreeMenuProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile
    ? <CategoryTreeMobile {...props} />
    : <CategoryTreeDesktop {...props} />;
}
