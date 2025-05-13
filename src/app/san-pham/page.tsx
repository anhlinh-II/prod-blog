"use client";
import { Button } from "@/components/common/Button";
import DisplayMedia from "@/components/common/DisplayMedia";
import PostViewer from "@/components/common/PostViewer";
import ProductCarousel from "@/components/product/ProductCarousel";
import ProductGallery from "@/components/product/ProductGallery";
import { Container } from "@mui/material";
import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

export default function ProductPage() {
    const [quantity, setQuantity] = useState(1);
    const [tab, setTab] = useState("description");
    const [isDisplayMedia, setIsDisplayMedia] = useState(false);

    const images = ['/test.jpg', '/banner1.jpg', '/test2.jpg', '/test3.jpg', '/test4.jpg', '/test5.jpg'];

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const [content, setContent] = useState(`
        <p><em>Bếp chiên giờ đây không còn quá xa lạ trên thị trường nữa. Sản phẩm được ứng dụng khá nhiều ở mọi nơi: 
        hàng ăn nhanh, các cơ sở kinh doanh ăn uống, nhà hàng… Với sự tiện lợi mang lại của nó, càng ngày bếp chiên càng được 
        sản xuất thêm với đa dạng mẫu mã, chức năng cải tiến, phù hợp với mục đích và nhu cầu sử dụng của các khách hàng. Trong 
        đó, dòng bếp chiên tách dầu 12L xuất hiện đã tạo nên một sự lựa chọn mới cho các nhà hàng, quán ăn đang tìm kiếm một chiếc 
        bếp với hiệu năng chiên rán cao mà tiết kiệm dầu.</em></p>
        <div class="bg-blue-200 p-4 rounded-md border border-blue-300">
          <h2 class="text-center font-bold">NỘI DUNG CHÍNH</h2>
          <ul class="list-disc pl-5 mt-2">
            <li><a href="#gioi-thieu">Giới thiệu mẫu bếp chiên tách dầu 12L</a></li>
            <li>Lợi ích của việc sử dụng các loại bếp có công nghệ tách dầu</li>
            <li>Thông số kỹ thuật model tách dầu 12L</li>
            <li>Cơ chế hoạt động của bếp chiên tách dầu 12L</li>
            <li>Hướng dẫn sử dụng và vệ sinh sản phẩm</li>
            <li>Một số lưu ý khi sử dụng các loại bếp có công nghệ tách dầu</li>
            <li>Địa chỉ uy tín để mua bếp chiên 12L tách dầu</li>
          </ul>
        </div>
        <h2 id="gioi-thieu" class="mt-6 text-xl font-bold text-black">Giới thiệu mẫu bếp chiên tách dầu 12L</h2>
        <p>Hiện nay có khá nhiều mẫu mã <span class="text-red-600 italic">bếp chiên nhưng giá rẻ</span> Hiện nay có khá nhiều 
        mẫu mã bếp chiên nhúng giá rẻ với nhiều công năng được nâng cấp. Để thuận tiện cho quá trình chế biến thực phẩm, cũng như 
        là đáp ứng những nhu cầu người dùng, bếp chiên được ra mắt với dòng sản phẩm mới, có tên gọi là bếp chiên dầu nước. Bếp có 
        nhiều kích cỡ và dung tích khác nhau, phù hợp cho nhu cầu sử dụng. Tuy nhiên, loại bếp chiên tách dầu 12L là dòng bếp gọn 
        nhỏ và được ứng dụng rộng rãi ở các hộ gia đình, các cửa hàng bán đồ ăn nhanh, cơ sở kinh doanh ăn uống, các nhà máy, xí 
        nghiệp cần chế biến thực phẩm với số lượng tương đối. Bếp đem lại nhiều lợi ích cho người dùng, giảm thiểu chi phí nhân 
        công và tiết kiệm thời gian khá nhiều.</p>
       `);

    const specs = [
        { key: "Kích thước", value: "15x15x10 cm" },
        { key: "Trọng lượng", value: "500g" },
        { key: "Chất liệu", value: "Nhựa ABS" },
        { key: "Nguồn điện", value: "USB 5V" },
        { key: "Màu sắc", value: "Xanh Lá" },
        { key: "Bảo hành", value: "12 tháng" },
        { key: "Xuất xứ", value: "Việt Nam" },
        { key: "Bảo hành", value: "12 tháng" },
        { key: "Xuất xứ", value: "Việt Nam" },
        { key: "Bảo hành", value: "12 tháng" },
        { key: "Xuất xứ", value: "Việt Nam" },
    ];


    return (
        <div className="">
            <main className="flex-grow py-6">
                <Container maxWidth={"lg"}>

                    <section className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 p-2 max-w-6xl mb-10">
                        {/* Left Images */}
                        <ProductGallery images={images} tag="MỚI" setIsDisplayMedia={() => setIsDisplayMedia(true)}/>

                        {/* Product Info */}
                        <div className="space-y-4 border border-gray-300 rounded-xl p-4">
                            <h1 className="text-2xl font-semibold line-clamp-3">
                                Quạt Bàn Usb Xoay Ít Ồn - Xanh Lá Quạt Bàn Usb Xoay Ít Ồn - Xanh Lá
                            </h1>
                            <p className="text-sm text-gray-500 flex justify-between">
                                <span className="text-black">SKU: 4547315193042 (4 Đã bán)</span>
                                <span className="text-black flex items-center gap-2"><FaEye /><span>5637</span></span>
                            </p>
                            <p className="text-2xl font-bold text-red-700">1.699.000 
                                <span className="text-sm font-normal"> VND</span>
                                <span className="text-lg line-through ms-4 text-gray-500 font-medium">2.099.000 VND</span>
                            </p>
                            
                            {/* Product Specifications List */}
                            <ul className="list-disc pl-5 text-sm space-y-1">
                            {specs.slice(0, 8).map((item, index) => (
                                <li key={index} className="text-base mb-2">
                                    <span className="font-semibold">{item.key}: </span>
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
                        {tab === "description" && (
                            <PostViewer title={""} content={content} />
                        )}

                        {tab === "spec" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
                            {[0, 1].map((colIdx) => {
                                const filtered = Object.entries(specs).filter((_, idx) => idx % 2 === colIdx);
                                const needPaddingRow =
                                    Object.entries(specs).length % 2 !== 0 && colIdx === 1;

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
                                                    {value.key}
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
                        <ProductCarousel />
                    </section>
                </Container>
            </main>

            {isDisplayMedia && (
                <DisplayMedia images={images} setIsDisplayMedia={setIsDisplayMedia} />
            )}

        </div>
    );
}
