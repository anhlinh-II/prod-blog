// components/common/PostViewer.tsx
"use client";

import { useRef, useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

type PostViewerProps = {
	title: string;
	content: string;
};

export default function PostViewer({ title, content }: PostViewerProps) {
	const contentRef = useRef<HTMLDivElement>(null);
	const [expanded, setExpanded] = useState(false);
	const [showToggle, setShowToggle] = useState(false);

	useEffect(() => {
		const contentEl = contentRef.current;
		if (contentEl && contentEl.scrollHeight > 500) {
			setShowToggle(true);
		}
	}, [content]);

	return (
		<div className="relative p-6 rounded">
			{title && (
				<h1 className="text-2xl font-bold mb-4">{title}</h1>
			)}
			<div
				ref={contentRef}
				className={`prose prose-blue max-w-none overflow-hidden transition-all duration-300 
					${expanded ? 'max-h-none' : 'max-h-[500px]'
				}`}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
			{showToggle && (
				<button
					className="absolute flex flex-col items-center justify-center -bottom-6 w-full mt-4 py-3 font-bold"
				>
					{!expanded && (
						<div className='w-full h-10 bg-gradient-to-t from-gray-50 to-white/60'></div>
					)}
					<div className='bg-white w-xl rounded-b-2xl py-0.5 border flex items-center justify-center gap-2 cursor-pointer
						hover:text-red-800'
						onClick={() => setExpanded(!expanded)}>
						<p>{expanded ? 'Ẩn bớt' : 'Xem thêm'}</p>
						<span
							className={`transform transition-transform duration-300 
								${expanded ? 'rotate-180' : 'rotate-0'}`}>
							<IoIosArrowDown />
						</span>
					</div>
				</button>
			)}
			<style jsx>{`
			.prose img {
			  max-height: 500px;
			  max-width: 60%;
			},
			.prose video {
			  margin-left: auto;
			  margin-right: auto;
			  display: block;
			  max-height: 500px;
			}
		  `}</style>
		</div>
	);
}
