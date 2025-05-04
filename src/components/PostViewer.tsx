// components/PostViewer.tsx
type PostViewerProps = {
    title: string;
    content: string;
  };
  
  export default function PostViewer({ title, content }: PostViewerProps) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
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
  