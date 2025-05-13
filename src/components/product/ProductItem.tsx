import Image from 'next/image';
import Link from 'next/link';

type ProductItemProps = {
  name: string;
  image: string;
  tag?: string;
  oldPrice: number;
  price: number;
};

export default function ProductItem({
  name,
  image,
  tag,
  oldPrice,
  price,
}: ProductItemProps) {
  return (
    <div className="w-full border rounded-xl overflow-hidden shadow-sm bg-white hover:bg-gray-100 hover:text-red-800">
      <Link href={`/san-pham`}>
      <div className="relative">
        {tag && (
          <div className="absolute top-2 left-2 bg-[#5c0a0a] text-white text-xs font-bold px-2 py-1 rounded">
            {tag}
          </div>
        )}
        <Image
            src={image}
            alt={name}
            width={200}
            height={150}
            className="object-cover w-full cursor-pointer"
        />
      </div>

      <div className="p-3 space-y-2">
        <p className="text-sm font-medium line-clamp-3 min-h-[3.7rem] cursor-pointer">{name}</p>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 line-through text-sm">
            {oldPrice.toLocaleString()}VND
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[#a00404]">
            {price.toLocaleString()} VND
          </span>
        </div>

        <button className="w-full mt-2 py-2 border border-gray-500 rounded font-medium 
            text-sm hover:bg-red-900 hover:text-white cursor-pointer transition-all ease-in duration-150">
          Mua Hàng
        </button>
      </div>
      </Link>
    </div>
  );
}
