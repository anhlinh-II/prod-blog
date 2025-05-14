"use client";
import { Button } from "@/components/common/Button";
import DisplayMedia from "@/components/common/DisplayMedia";
import PostViewer from "@/components/common/PostViewer";
import ProductCarousel from "@/components/product/ProductCarousel";
import ProductGallery from "@/components/product/ProductGallery";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { findSimilarProducts, getProductBySlug } from "@/services/ProductService";
import { ProductResponse, ProductShortResponse } from "@/types/Product";
import { formatNumberWithCommas } from "@/utils/FormatNumber";
import Breadcrumb from "@/components/common/Breadcrumb";

interface ProductPageProps {
  params: {
    productSlug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
    const { productSlug } = params;
    const [product, setProduct] = useState<ProductResponse>();
    const [similarProducts, setSimilarProducts] = useState<ProductShortResponse[]>();
	const [isLoading, setIsLoading] = useState(true);
    const [price, setPrice] = useState<number>();
    const [quantity, setQuantity] = useState(1);
    const [tab, setTab] = useState("description");
    const [displayMediaIndex, setDisplayMediaIndex] = useState<number | null>(null);

    const images = ['/test4.jpg', '/test2.jpg', '/test3.jpg', '/test4.jpg', '/test5.jpg', '/test2.jpg', '/test.jpg', '/test5.jpg'];

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const product = await getProductBySlug(productSlug);
                setProduct(product.result);
                
                setPrice(product.result.price * (100 - product.result.discountPercent)/100);
                
                const similarPs = await findSimilarProducts(productSlug);
                setSimilarProducts(similarPs.result);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productSlug]);

    
	const breadcrumbItems = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Sản phẩm", href: "/danh-muc" },
		{ label: product?.name },
  	];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} title={product?.name}/>
            <main className="flex-grow py-6">
                <Container maxWidth={"lg"}>
                {isLoading || !product || !price ? (
                    <section className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 p-2 max-w-6xl mb-10">
                        <div className="space-y-4 border border-gray-300 rounded-xl p-4 animate-pulse"></div>
                        <div className="space-y-4 border border-gray-300 rounded-xl p-4 animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                            <ul className="space-y-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li key={index} className="h-4 bg-gray-300 rounded w-5/6"></li>
                            ))}
                            </ul>
                            <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-300 rounded"></div>
                            <div className="w-10 h-10 bg-gray-300 rounded"></div>
                            </div>
                            <div className="w-[80%] h-10 bg-gray-300 rounded mx-auto"></div>
                            <div className="w-[80%] h-10 bg-gray-300 rounded mx-auto"></div>
                        </div>
                    </section>
                    ) : (
                    <section className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 p-2 max-w-6xl mb-10">
                        {/* Left Images */}
                        <ProductGallery 
                            images={images} 
                            tag="MỚI" 
                            discountPercent={product.discountPercent} 
                            setIsDisplayMedia={setDisplayMediaIndex}
                        />

                        {/* Product Info */}
                        <div className="space-y-4 border border-gray-300 rounded-xl p-4">
                            <h1 className="text-2xl font-semibold line-clamp-3">
                                {product?.name}
                            </h1>
                            <p className="text-sm text-gray-500 flex justify-between">
                                <span className="text-black">ID: {product?.id} ({product?.quantitySold} Đã bán)</span>
                                <span className="text-black flex items-center gap-2">
                                    <FaEye />
                                    <span>{product?.views ? product.views : 0}</span>
                                </span>
                            </p>
                            <p className="text-2xl font-bold text-red-700">{formatNumberWithCommas(price)}
                                <span className="text-sm font-normal"> VND</span>
                                <span className="text-lg line-through ms-4 text-gray-500 font-medium">
                                    {formatNumberWithCommas(product?.price)} VND
                                </span>
                            </p>
                            
                            {/* Product Specifications List */}
                            <ul className="list-disc pl-5 text-sm space-y-1">
                            {product?.specifications.slice(0, 8).map((item, index) => (
                                <li key={index} className="text-base mb-2">
                                    <span className="font-semibold">{item.specKey}: </span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                            </ul>

                            <div className="flex items-center justify-center gap-2 w-full my-4">
                                <Button variant="secondary" onClick={handleDecrease}>
                                    <FiMinus />
                                </Button>
                                <span className="border w-10 text-center py-1 rounded">{quantity}</span>
                                <Button variant="secondary" onClick={handleIncrease}>
                                    <FiPlus />
                                </Button>
                            </div>

                            <div className="flex flex-col items-center justify-center w-full gap-4 mt-4">
                                <Button className="flex-1 w-[80%] text-white bg-gray-800 hover:bg-gray-700">
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button variant="outline" className="flex-1 w-[80%]">
                                    Mua nhanh
                                </Button>
                            </div>
                        </div>
                    </section>
                    )}

                    {/* Tabs */}
                    <section className="col-span-2 my-10">
                        <div className="grid grid-cols-2 border-b">
                            <button
                                onClick={() => setTab("description")}
                                className={`px-6 py-2 font-semibold cursor-pointer
                                    ${tab === "description" ? "border-b-2 border-black" : "text-gray-500"}`}
                            >
                                Mô tả sản phẩm
                            </button>
                            <button
                                onClick={() => setTab("spec")}
                                className={`px-6 py-2 font-semibold cursor-pointer
                                    ${tab === "spec" ? "border-b-2 border-black" : "text-gray-500"}`}
                            >
                                Thông số kỹ thuật
                            </button>
                        </div>

                        <div className="mt-4">
                        {tab === "description" && product?.description && (
                            <PostViewer title={""} content={product?.description} />
                        )}

                        {tab === "spec" && product?.specifications && (
                            <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
                            {[0, 1].map((colIdx) => {
                                const filtered = Object.entries(product?.specifications).filter((_, idx) => idx % 2 === colIdx);
                                const needPaddingRow =
                                    Object.entries(product?.specifications).length % 2 !== 0 && colIdx === 1;

                                return (
                                    <table
                                        key={colIdx}
                                        className="w-full text-left border border-gray-300 table-fixed"
                                    >
                                        <tbody>
                                        {filtered.map(([key, value], rowIdx) => (
                                            <tr key={key} 
                                                className={`h-12 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                                <th className="px-4 py-2 text-center border border-gray-300 font-bold 
                                                    text-gray-700 w-1/3 align-middle bg-inherit">
                                                    {value.specKey}
                                                </th>
                                                <td className="px-4 py-2 border text-center border-gray-300 align-middle">
                                                    {value.value}
                                                </td>
                                            </tr>
                                        ))}
                                        {needPaddingRow && (
                                            <tr className="h-12">
                                                <th className="px-4 py-2 border border-gray-300 bg-gray-50"></th>
                                                <td className="px-4 py-2 border border-gray-300"></td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                );
                            })}
                            </div>
                        )}
                        </div>
                    </section>

                    {/* Similar products */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">Sản phẩm tương tự</h2>
                        <ProductCarousel products={similarProducts}/>
                    </section>
                </Container>
            </main>

            {displayMediaIndex !== null && (
                <DisplayMedia 
                    images={images} 
                    index={displayMediaIndex}
                    setIsDisplayMedia={setDisplayMediaIndex} 
                />
            )}

        </div>
    );
}
