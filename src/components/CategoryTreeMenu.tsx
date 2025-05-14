'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useApp } from '@/utils/AppContext';
import { useRouter } from 'next/navigation';


export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  children: CategoryResponse[];
}

interface CategoryTreeMenuProps {
  categorySlug?: string;
  setCategory: (category: CategoryResponse) => void;
}

export default function CategoryTreeMenu({ categorySlug, setCategory }: CategoryTreeMenuProps) {
  const { categories } = useApp();
  const router = useRouter();
  const [showCategories, setShowCategories] = useState<CategoryResponse[]>();
  const [isMobile, setIsMobile] = useState(false);

  const resetToRoot = () => {
    router.push('/danh-muc');
  };

  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Filter categories based on the current category slug
    const filteredCategories = categories.filter((category) => {
      return category.slug === categorySlug || category.children.some((child) => child.slug === categorySlug);
    });
    const filteredChildren = filteredCategories.flatMap((category) => category.children);
    
    const filteredParents = categories.filter(
      (category) => category.children.some(
        child => child.children.some(child => child.slug === categorySlug))).flatMap((category) => category.children);

    if(filteredChildren.length === 0) {
      setShowCategories(filteredParents);
    } else {
      setShowCategories(filteredChildren);
    }

    // Find the exact category by slug (search recursively)
    function findCategoryBySlug(categories: CategoryResponse[], slug?: string): CategoryResponse | undefined {
      for (const category of categories) {
        if (category.slug === slug) return category;
        if (category.children && category.children.length > 0) {
          const found = findCategoryBySlug(category.children, slug);
          if (found) return found;
        }
      }
      return undefined;
    }

    const foundCategory = findCategoryBySlug(categories, categorySlug);

    if (foundCategory) {
      setCategory(foundCategory);
    }
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [categorySlug]);

  return (
    <div className="w-full max-w-sm bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-1 p-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-xl">
        🛍️ Danh mục sản phẩm
      </h2>
      {categorySlug && showCategories != categories && (
        <button
          onClick={resetToRoot}
          className="text-sm text-gray-600 px-4 py-2 cursor-pointer hover:text-red-600 hover:underline"
        >
          ← Xem tất cả danh mục
        </button>
      )}
      <ul className="divide-y divide-gray-100">
        {showCategories && showCategories.length > 0 ?
          showCategories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              level={0} 
              isMobile={isMobile} 
            />
          )) : (
          categories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              level={0} 
              isMobile={isMobile} 
            />
        )))}
      </ul>
    </div>
  );
}

function CategoryItem({ 
  category, 
  level = 0, 
  isMobile = false 
}: { 
  category: CategoryResponse; 
  level?: number;
  isMobile?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  // Toggle for mobile
  const handleToggle = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li 
      className="relative"
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
    >
        <Link
          href={`/danh-muc/${category.slug}`}
          className={`flex-1 ${level === 0 ? 'font-semibold text-gray-800' : 'font-medium text-gray-700'}`}
        >
      <div 
        className={`flex items-center justify-between px-4 py-3 transition-colors ${level === 0 ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}
        onClick={handleToggle}
      >
          {category.name}
        {hasChildren && (
          <>
            {isMobile ? (
              <FiChevronDown className={`ml-2 text-2xl transition-transform ${isExpanded ? 'text-red-500 rotate-180' : 'text-gray-400'}`} />
            ) : (
              <FiChevronRight className={`ml-2 text-2xl transition-transform ${isExpanded ? 'text-red-500 rotate-90' : 'text-gray-400'}`} />
            )}
          </>
        )}
      </div>
        </Link>

      {hasChildren && (isMobile ? isExpanded : isExpanded) && (
        <div
          className={`
            ${isMobile ? 
              'relative ml-4 border-l-2 border-gray-200' : 
              `absolute ${level === 0 ? 'top-0 left-full -ml-1' : 'top-0 left-full'} min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-xl z-10`
            }
          `}
        >
          <ul className={isMobile ? 'py-1' : 'py-1'}>
            {category.children.map((child) => (
              <CategoryItem 
                key={child.id} 
                category={child} 
                level={level + 1} 
                isMobile={isMobile} 
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}