// components/common/PostViewer.tsx
"use client";

import { useRef } from 'react';

type PostViewerProps = {
	title: string;
	content: string;
};

export default function PostViewer({ title, content }: PostViewerProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<div className="relative p-6 rounded-2xl">
			{title && (
				<h1 className="text-2xl font-bold mb-4">{title}</h1>
			)}
			<div
				ref={contentRef}
				className="ql-editor static-page-content"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
			<style jsx global>{`
				.ql-editor {
					font-size: 16px;
					line-height: 1.7;
					color: #222;
					padding: 0;
					background: transparent;
				}
				.ql-editor h1 { font-size: 2.25rem; }
				.ql-editor h2 { font-size: 1.5rem; }
				.ql-editor h3 { font-size: 1.25rem; }
				.ql-editor h4 { font-size: 1.1rem; }
				.ql-editor h5 { font-size: 1rem; }
				.ql-editor h6 { font-size: 0.95rem; }
				.ql-editor ul, .ql-editor ol {
					padding-left: 2em;
					margin-bottom: 1em;
				}
				.ql-editor li {
					margin-bottom: 0.25em;
				}
				.ql-editor ul {
					list-style-type: disc;
				}
				.ql-editor ol {
					list-style-type: decimal;
				}
				.ql-editor ul li::marker {
					color: #222;
				}
				.ql-editor ol li::marker {
					color: #222;
				}
				.ql-editor blockquote {
					border-left: 4px solid #eee;
					margin: 1em 0;
					padding-left: 1em;
					color: #666;
				}
				.ql-editor img {
					max-width: 100%;
					max-height: 500px;
					display: block;
					margin: 1em 0 1em 0; /* sát lề trái */
					text-align: left;
				}
				.ql-editor pre {
					background: #f6f8fa;
					padding: 1em;
					border-radius: 6px;
					overflow-x: auto;
				}
				.ql-editor strong, .ql-editor b {
					font-weight: bold;
				}
				.ql-editor em, .ql-editor i {
					font-style: italic;
				}
				.ql-editor .ql-indent-1 { padding-left: 3em; }
				.ql-editor .ql-indent-2 { padding-left: 6em; }
				.ql-editor .ql-indent-3 { padding-left: 9em; }
				.ql-editor .ql-align-center { text-align: center; }
				.ql-editor .ql-align-right { text-align: right; }
				.ql-editor .ql-align-justify { text-align: justify; }
			`}</style>
		</div>
	);
}
