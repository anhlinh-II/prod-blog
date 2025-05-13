'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { fetchCategories } from '@/services';

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  children: CategoryResponse[];
}

export default function CategoryTreeMenu() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data) setCategories(data);
    };
    loadCategories();
  }, []);

  return (
    <div className="w-full max-w-xs bg-white border rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Danh mục sản phẩm</h2>
      <ul className="space-y-1">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} level={0} />
        ))}
      </ul>
    </div>
  );
}

function CategoryItem({
  category,
  level,
}: {
  category: CategoryResponse;
  level: number;
}) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <li className="relative group">
      <div className="flex items-center justify-between pr-2">
        <Link
          href={`/danh-muc/${category.slug}`}
          className="block px-3 py-2 font-medium rounded hover:bg-red-100 transition w-full"
        >
          {category.name}
        </Link>
        {hasChildren && (
          <FiChevronRight className="text-gray-500 group-hover:text-red-600 transition" />
        )}
      </div>

      {hasChildren && (
        <div
          className="absolute top-0 left-full ml-2 min-w-[200px] bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
        >
          <ul className="py-2">
            {category.children.map((child) => (
              <li key={child.id} className="relative group">
                <div className="flex items-center justify-between pr-2">
                  <Link
                    href={`/danh-muc/${child.slug}`}
                    className="block px-3 py-2 text-sm hover:bg-red-100 transition w-full"
                  >
                    {child.name}
                  </Link>
                  {child.children.length > 0 && (
                    <FiChevronRight className="text-gray-400 group-hover:text-red-600 transition" />
                  )}
                </div>

                {child.children.length > 0 && (
                  <div
                    className="absolute top-0 left-full ml-2 min-w-[200px] bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20"
                  >
                    <ul className="py-2">
                      {child.children.map((grand) => (
                        <CategoryItem
                          key={grand.id}
                          category={grand}
                          level={level + 1}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
