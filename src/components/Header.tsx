'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useProductCategories } from '@/hooks/ReactQueries';
import { useAppContext } from '@/utils/AppContext';
import CartSidebar from '@/app/(public)/gio-hang/CartSidebar';
import Image from 'next/image';
import { CategoryResponse } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';

// Dropdown Component
interface DropdownProps {
  categories: CategoryResponse[];
  level: number;
  parentHovered: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ categories, level, parentHovered }) => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  
  if (!parentHovered) return null;

  return (
    <div className={`
      absolute bg-white shadow-lg border rounded-xl min-w-48 z-50
      ${level === 0 ? 'top-[80%] left-0 mt-1' : 'top-0 left-full -ml-1'}
    `}>
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative"
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <Link
            href={`/danh-muc/${category.slug}`}
            className=" flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-blue-50 
            hover:text-blue-600 transition-colors rounded-xl"
          >
            <span className='w-max'>{category.name}</span>
            {category.children && category.children.length > 0 && (
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            )}
          </Link>
          
          {category.children && category.children.length > 0 && (
            <Dropdown
              categories={category.children}
              level={level + 1}
              parentHovered={hoveredCategory === category.id}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryResponse[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, categories }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderMobileCategory = (category: CategoryResponse, level: number = 0) => (
    <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
      <div className="flex items-center justify-between py-2">
        <Link
          href={`/danh-muc/${category.slug}`}
          className="flex-1 text-gray-700 hover:text-blue-600 transition-colors"
          onClick={onClose}
        >
          {category.name}
        </Link>
        {category.children && category.children.length > 0 && (
          <button
            onClick={() => toggleCategory(category.id)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                expandedCategories.has(category.id) ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>
      {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
        <div className="border-l-2 border-gray-200 ml-2">
          {category.children.map((child) => renderMobileCategory(child, level + 1))}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-45 lg:hidden">
      <div className="fixed inset-0 bg-opacity-50" onClick={onClose} />
      <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-2 overflow-y-auto h-full pb-20">
        <Link
            href="/tin-tuc"
            className="font-semibold block text-gray-700 hover:text-blue-600 transition-colors py-2"
            onClick={onClose}
        >
            Bảng tin tức
        </Link>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800 mb-2">Danh mục sản phẩm</h3>
            {categories.map((category) => renderMobileCategory(category))}
          </div>
          
          <div className="border-t border-gray-300 pt-4 mt-4 space-y-3">
            <Link
              href="/ve-chung-toi"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={onClose}
            >
              Về chúng tôi
            </Link>
            <Link
              href="/lien-he"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={onClose}
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const CategorySkeleton: React.FC = () => (
  <div className="flex items-center text-gray-400">
    <div className="animate-pulse flex items-center">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
      <ChevronDown className="ml-1 w-4 h-4" />
    </div>
  </div>
);

// Main Header Component
const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useProductCategories();
  
  // Cart context
  const { cart, toggleCart } = useAppContext();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const encodedKeyword = encodeURIComponent(searchQuery.trim());
      window.location.href = `/tim-kiem/${encodedKeyword}`;
    }
  };

  const handleCartClick = () => {
    toggleCart();
  };

  return (
    <>
      <header className="bg-gradient-to-r from-[#00A650] to-[#47b180] shadow-md sticky top-0 z-40" >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="w-full flex items-center justify-between h-16">
            <div className='flex items-center justify-start gap-4'>
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                {!isMobile ? (
                    <Image src={`/logo-long.jpg`} alt='Điện máy V Share' width={200} height={64} priority={true}/>
                ) : (
                    <Image src={`/logo.jpg`} alt='Điện máy V Share' width={56} height={56} priority={true} className='rounded-full p-1'/>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              {/* Categories Dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link
                href="/danh-muc" className="flex items-center py-3 text-gray-100 hover:text-gray-3000 font-medium 
                transition-colors cursor-pointer">
                    Danh mục sản phẩm
                    <ChevronDown className="ml-1 w-4 h-4" />
                </Link>
                {categoriesError ? (
                  <span className="text-red-500 font-medium">Lỗi tải danh mục</span>
                ) : (
                  <>
                    <Dropdown
                      categories={categories}
                      level={0}
                      parentHovered={isDropdownOpen}
                    />
                  </>
                )}
              </div>

              <Link
                href="/tin-tuc"
                className="text-gray-100 py-3 hover:text-gray-300 font-medium transition-colors"
              >
                Bảng tin tức
              </Link>
              
              <Link
                href="/ve-chung-toi"
                className="text-gray-100 py-3 hover:text-gray-300 font-medium transition-colors"
              >
                Về chúng tôi
              </Link>
              
              <Link
                href="/lien-he"
                className="text-gray-100 py-3 hover:text-gray-300 font-medium transition-colors"
              >
                Liên hệ
              </Link>
            </nav>
            </div>

            {/* Search Bar & Cart & Mobile Menu */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Search Bar */}
              <div className="hidden md:block flex-shrink-0 md:w-80 max-w-lg">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Bạn tìm sản phẩm gì..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-2 bg-white border border-white rounded-full focus:outline-none focus:ring-2 
                    focus:ring-gray-200 focus:border-transparent text-black"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-black 
                    hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="flex items-center relative m-1 ps-1 pe-3 text-white hover:text-gray-200 transition-colors cursor-pointer
                border border-white rounded-full"
              >
                <div className='relative p-2'>
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                </div>
                {!isMobile && (
                <p>Giỏ hàng</p>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-2 lg:hidden p-2 text-gray-100 hover:text-gray-300 transition-colors"
              >
                <Menu className="w-6 h-6" />
                <p>Danh mục</p>
              </button>
            </div>
          </div>
        </div>
      </header>
      {isMobile && (
        <div className="bg-white px-4 py-2 shadow-md sticky top-16 z-30">
            <form onSubmit={handleSearch} className="relative">
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <Search className="w-5 h-5" />
            </button>
            </form>
        </div>
        )}


      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default Header;