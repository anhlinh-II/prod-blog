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
import { findSimilarProducts, getProductBySlug, increaseProductViews } from "@/services/ProductService";
import { ProductResponse, ProductShortResponse } from "@/types/Product";
import { formatNumberWithCommas } from "@/utils/FormatNumber";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useAppContext } from "@/utils/AppContext";
import Toast from "@/components/common/Toast";

interface ProductPageProps {
  params: {
    productSlug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { productSlug } = params;
    const [product, setProduct] = useState<ProductResponse>();
    const [similarProducts, setSimilarProducts] = useState<ProductShortResponse[]>();
    const [images, setImages] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
    const [price, setPrice] = useState<number>();
    const [quantity, setQuantity] = useState(1);
    const [displayMediaIndex, setDisplayMediaIndex] = useState<number | null>(null);
    const { cart, addToCart } = useAppContext();
    const [toast, setToast] = useState<{
        message: string;
        visible: boolean;
        type?: 'success' | 'error' | 'warning';
    }>({
        message: '',
        visible: false,
        type: 'success',
    });

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };
    
    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: '', visible: false, type }), 3000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const product = await getProductBySlug(productSlug);

                setProduct(product.result);
                if(product.result.images && product.result.images.length > 0) {
                    setImages(product.result.images.filter(image => image).map(image => `${apiUrl}${image}`));
                    console.log(images)
                }
                setPrice(product.result.price * (100 - product.result.discountPercent)/100);
                
                const similarPs = await findSimilarProducts(productSlug);
                setSimilarProducts(similarPs.result);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productSlug]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            increaseProductViews(productSlug);
        }, 3000);

        return () => clearTimeout(timeout); 
    }, [productSlug]);

    
	const breadcrumbItems = [
		{ label: "🏠 Trang chủ", href: "/" },
		{ label: "Sản phẩm", href: "/danh-muc" },
		{ label: product?.name },
  	];

    return (
        <div className="">
            
            <Breadcrumb items={breadcrumbItems}/>
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
                        {images.length > 0 ? (
                        <ProductGallery 
                            images={images} 
                            name={product.name}
                            tag="MỚI" 
                            discountPercent={product.discountPercent} 
                            setIsDisplayMedia={setDisplayMediaIndex}
                        />
                        ) : (
                            <div className="text-gray-500 h-40 w-full md:h-full bg-gray-100 animate-pulse rounded-2xl p-4">Không thể tải ảnh</div> 
                        )}

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
                            <div className="flex flex-col-reverse md:flex-row md:items-center text-red-700">
                                <p className="">
                                    <span className="text-2xl font-bold">{formatNumberWithCommas(price)}</span>
                                    <span className="text-sm font-normal"> VND</span>
                                </p>
                                <span className="text-lg line-through md:ms-4 text-gray-500 font-medium">
                                    {formatNumberWithCommas(product?.price)} VND
                                </span>
                            </div>
                            
                            {/* Product attributes List */}
                            <ul className="list-disc pl-5 text-sm space-y-1">
                            {product?.attributes.slice(0, 8).map((item, index) => (
                                <li key={index} className="text-base mb-2">
                                    <span className="font-semibold">{item.specKey}: </span>
                                    <span>{item.value}</span>
                                </li>
                            ))}
                            </ul>

                            <div className="ms-1">
                                Tình trạng: 
                                <span className={`ms-2 font-bold ${product?.stockQuantity > 0 ? 'text-blue-600' : 'text-red-700'}`}>
                                    {product?.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>

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
                                <Button className="flex-1 w-[80%] bg-red-700 hover:bg-red-600 text-white">
                                    Liên hệ ngay
                                </Button>
                                <Button className="flex-1 w-[80%] text-red-700 bg-white hover:bg-gray-100
                                    border border-red-700"
                                    onClick={() => {
                                        if(cart.length >= 5) {
                                            showToast("Bạn chỉ có thể đưa tối đa 5 sản phẩm vào giỏ hàng.", "warning");
                                        } else {
                                        if (product) {
                                            addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.specialPrice || product.price,
                                                image: product.images && product.images.length > 0 ? product.images[0] : '',
                                                quantity: quantity
                                            });
                                            showToast(`Đã thêm sản phẩm vào giỏ hàng`, 'success');
                                        }
                                        }
                                    }}>
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>
                        </div>
                    </section>
                    )}

                    <section className="col-span-2 my-10">
                    {/* Thông số kỹ thuật */}
                    {product?.attributes && product?.attributes.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                        
                        <div className="md:hidden col-span-1">
                            <table className="w-full text-left border border-gray-300 table-fixed">
                            <tbody>
                                {Object.entries(product.attributes).map(([key, value], idx) => (
                                <tr key={key} className={`h-12 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                    <th className="px-4 py-2 text-center border border-gray-300 font-bold 
                                    text-gray-700 w-1/3 align-middle bg-inherit">
                                    {value.specKey}
                                    </th>
                                    <td className="px-4 py-2 border text-center border-gray-300 align-middle">
                                    {value.value}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>

                        {[0, 1].map((colIdx) => {
                        const filtered = Object.entries(product.attributes).filter((_, idx) => idx % 2 === colIdx);
                        const needPaddingRow =
                            Object.entries(product.attributes).length % 2 !== 0 && colIdx === 1;

                        return (
                            <div key={colIdx} className="hidden md:block">
                                <table className="w-full text-left border border-gray-300 table-fixed">
                                    <tbody>
                                    {filtered.map(([key, value], rowIdx) => (
                                        <tr key={key} className={`h-12 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
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
                            </div>
                        );
                        })}
                        </div>
                    </>
                    )}

                    {/* Mô tả sản phẩm */}
                    {product?.description && product?.description != "" && (
                        <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
                        <PostViewer title={""} content={product.description} />
                        </div>
                    )}
                    </section>

                    {/* Similar products */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">Sản phẩm tương tự</h2>
                        <ProductCarousel products={similarProducts}/>
                    </section>
                    
                    {/* Toast */}
                    <Toast message={toast.message} visible={toast.visible} type={toast.type} />
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
