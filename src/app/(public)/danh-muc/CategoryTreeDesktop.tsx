'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { CategoryResponse } from '@/types';
import { CategoryTreeMenuProps } from './CategoryWrapper';
import { useProductCategories } from '@/hooks/ReactQueries';

export default function CategoryTreeDesktop({ categorySlug, setCategory }: CategoryTreeMenuProps) {
  const { data: categories, isLoading, isError } = useProductCategories();
  const router = useRouter();
  const [showCategories, setShowCategories] = useState<CategoryResponse[]>();

  const resetToRoot = () => {
    router.push('/danh-muc');
  };

  useEffect(() => {
    if(categories) {
    // Tìm category phù hợp theo slug
    const filteredCategories = categories.filter((category) =>
      category.slug === categorySlug || category.children.some((child) => child.slug === categorySlug)
    );
    const filteredChildren = filteredCategories.flatMap((category) => category.children);

    const filteredParents = categories.filter((category) =>
      category.children.some((child) => child.children.some((child) => child.slug === categorySlug))
    ).flatMap((category) => category.children);

    if (filteredChildren.length === 0) {
      setShowCategories(filteredParents);
    } else {
      setShowCategories(filteredChildren);
    }

    // Tìm category để gọi setCategory
    function findCategoryBySlug(categories: CategoryResponse[], slug?: string): CategoryResponse | undefined {
      for (const category of categories) {
        if (category.slug === slug) return category;
        if (category.children?.length) {
          const found = findCategoryBySlug(category.children, slug);
          if (found) return found;
        }
      }
      return undefined;
    }

      const found = findCategoryBySlug(categories, categorySlug);
      if (found) setCategory(found);
    }
  }, [categorySlug]);

  return (
    <div className="w-full max-w-sm bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-1 p-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-xl">
        🛍️ Danh mục sản phẩm
      </h2>
      {categorySlug && showCategories !== categories && (
        <button
          onClick={resetToRoot}
          className="text-sm text-gray-600 px-4 py-2 cursor-pointer hover:text-red-600 hover:underline"
        >
          ← Xem tất cả danh mục
        </button>
      )}
      <ul className="divide-y divide-gray-100">
        {categories && (showCategories?.length ? showCategories : categories).map((category) => (
          <CategoryItem key={category.id} category={category} level={0} />
        ))}
      </ul>
    </div>
  );
}

function CategoryItem({
  category,
  level = 0
}: {
  category: CategoryResponse;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children?.length > 0;

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link
        href={`/danh-muc/${category.slug}`}
        className={`flex-1 ${level === 0 ? 'font-semibold text-gray-800' : 'font-medium text-gray-700'}`}
      >
        <div
          className={`flex items-center justify-between px-4 py-3 transition-colors ${
            level === 0 ? 'hover:bg-red-50' : 'hover:bg-gray-50'
          }`}
        >
          {category.name}
          {hasChildren && (
            <FiChevronRight
              className={`ml-2 text-2xl transition-transform ${isExpanded ? 'text-red-500 rotate-90' : 'text-gray-400'}`}
            />
          )}
        </div>
      </Link>

      {hasChildren && isExpanded && (
        <div
          className={`
            absolute left-full top-0 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-xl z-10
          `}
        >
          <ul className="py-1">
            {category.children.map((child) => (
              <CategoryItem key={child.id} category={child} level={level + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
