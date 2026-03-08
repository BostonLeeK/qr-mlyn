"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose-content text-[1.0625rem] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => (
            <p className="mb-5 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          s: ({ children }) => (
            <s className="line-through">{children}</s>
          ),
          ul: ({ children }) => (
            <ul className="my-5 list-inside list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 list-inside list-decimal space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="pl-2">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
