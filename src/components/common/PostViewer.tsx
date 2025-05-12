// components/common/PostViewer.tsx
"use client";

import { useRef, useState, useEffect } from 'react';

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
					onClick={() => setExpanded(!expanded)}
					className="w-full mt-4 py-3 font-bold text-black hover:text-blue-600 cursor-pointer bg-gradient-to-t from-gray-300 to-transparent"
				>
					{expanded ? 'Ẩn bớt' : 'Xem thêm'}
				</button>
			)}
			<style jsx>{`
			.prose img,
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
