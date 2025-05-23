'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CategoryResponse } from '@/types';
import { CategoryTreeMenuProps } from './CategoryWrapper';
import { useProductCategories } from '@/hooks/ReactQueries';

export default function CategoryTreeMobile({ categorySlug, setCategory }: CategoryTreeMenuProps) {
  const { data: categories, isLoading, isError } = useProductCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Mở rộng theo slug đang chọn
  useEffect(() => {
    function expandBySlug(categories: CategoryResponse[], slug?: string): Set<number> {
      const path: number[] = [];

      function findPath(cats: CategoryResponse[], target?: string): boolean {
        for (const cat of cats) {
          if (cat.slug === target) {
            path.push(cat.id);
            return true;
          }
          if (cat.children && findPath(cat.children, target)) {
            path.push(cat.id);
            return true;
          }
        }
        return false;
      }

      findPath(categories, slug);
      return new Set(path);
    }

    if(categories) {
      const expandedSet = expandBySlug(categories, categorySlug);
      setExpandedCategories(expandedSet);

      const found = findCategoryBySlug(categories, categorySlug);
      if (found) setCategory(found);
    }

  }, [categorySlug]);

  const toggleExpand = (id: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-1 p-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-xl">
        🛍️ Danh mục sản phẩm
      </h2>
      <ul className="divide-y divide-gray-100">
        {categories && categories.map((category) => (
          <CategoryMobileItem
            key={category.id}
            category={category}
            level={0}
            expandedCategories={expandedCategories}
            toggleExpand={toggleExpand}
          />
        ))}
      </ul>
    </div>
  );
}

function CategoryMobileItem({
  category,
  level,
  expandedCategories,
  toggleExpand,
}: {
  category: CategoryResponse;
  level: number;
  expandedCategories: Set<number>;
  toggleExpand: (id: number) => void;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);

  return (
    <>
      <li className="px-4 py-3 flex items-center justify-between" style={{ paddingLeft: `${level * 16 + 16}px` }}>
        <Link href={`/danh-muc/${category.slug}`} className="text-gray-800 font-medium flex-1">
          {category.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => toggleExpand(category.id)}
            className="ml-2 text-gray-500 hover:text-red-500 text-2xl"
          >
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </li>
      {hasChildren && isExpanded && category.children.map((child) => (
        <CategoryMobileItem
          key={child.id}
          category={child}
          level={level + 1}
          expandedCategories={expandedCategories}
          toggleExpand={toggleExpand}
        />
      ))}
    </>
  );
}

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
