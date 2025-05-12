// components/PostEditor.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
	onSubmit: (data: { title: string; content: string }) => void;
};

export default function PostEditor({ onSubmit }: Props) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handleSubmit = () => {
		onSubmit({ title, content });
	};

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ color: [] }, { background: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			['link', 'image'],
			['clean'],
		],
	}

	return (
		<div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
			<h2 className="text-xl font-bold mb-4">Tạo bài viết mới</h2>

			<input
				type="text"
				placeholder="Tiêu đề bài viết"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full border border-gray-300 rounded p-2 mb-4"
			/>

			<ReactQuill
				modules={modules}
				value={content}
				onChange={setContent}
				theme="snow"
				className="mb-4"
				placeholder="Nội dung bài viết..."
			/>

			<button
				onClick={handleSubmit}
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				Đăng bài
			</button>
		</div>
	);
}
