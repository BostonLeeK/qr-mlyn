"use client";

import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { marked } from "marked";

function toHtml(value: string): string {
  if (!value.trim()) return "<p></p>";
  if (value.trim().startsWith("<") && value.includes(">")) return value;
  return marked.parse(value, { async: false }) as string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  editorKey?: string;
}

const SIZES = [
  { k: "sm", label: "Мал.", px: "15px" },
  { k: "md", label: "Сер.", px: "17px" },
  { k: "lg", label: "Вел.", px: "19px" },
] as const;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Опис...",
  className = "",
  editorKey,
}: RichTextEditorProps) {
  const editor = useEditor(
    {
      extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: false,
        blockquote: false,
      }),
      Link.configure({ openOnClick: false }),
      TextStyle,
      FontSize,
    ],
    content: toHtml(value),
    editorProps: {
      attributes: {
        class: "font-body font-article min-h-[200px] w-full px-3 py-2.5 text-[1.0625rem] leading-[1.9] text-text outline-none [&_p]:mb-5 [&_p:last-child]:mb-0 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:list-inside [&_hr]:my-8 [&_hr]:border-border [&_a]:text-accent [&_a]:underline",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  },
  [editorKey]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = prompt("URL:");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={`rounded-md border border-border ${className}`}>
      <div className="flex flex-wrap gap-1 border-b border-border bg-bg-subtle px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 font-body text-sm font-bold text-text hover:bg-border ${editor.isActive("bold") ? "bg-border" : ""}`}
          title="Жирний"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 font-body text-sm italic text-text hover:bg-border ${editor.isActive("italic") ? "bg-border" : ""}`}
          title="Курсив"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded px-2 py-1 font-body text-sm text-text line-through hover:bg-border ${editor.isActive("strike") ? "bg-border" : ""}`}
          title="Закреслений"
        >
          S
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`rounded px-2 py-1 font-body text-sm text-text hover:bg-border ${editor.isActive("link") ? "bg-border" : ""}`}
          title="Посилання"
        >
          🔗
        </button>
        <span className="mx-1 w-px self-stretch bg-border" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-2 py-1 font-body text-sm text-text hover:bg-border ${editor.isActive("bulletList") ? "bg-border" : ""}`}
          title="Список"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded px-2 py-1 font-body text-sm text-text hover:bg-border"
          title="Роздільна лінія"
        >
          —
        </button>
        <span className="mx-1 w-px self-stretch bg-border" />
        {SIZES.map(({ k, label, px }) => (
          <button
            key={k}
            type="button"
            onClick={() => editor.chain().focus().setFontSize(px).run()}
            className="rounded px-2 py-1 font-body text-text hover:bg-border"
            title={label}
          >
            {label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
