"use client";

import { useState, useCallback } from "react";
import Tiptap from "./tiptap";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-[#8B4513] text-white"
        : "text-[#8B4513] hover:bg-[#8B4513]/5"
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleEditorReady = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  return (
    <div className="border border-[#8B4513]/10 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-2 border-b border-[#8B4513]/10">
        <MenuButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-[#8B4513]/10 mx-1" />

        <MenuButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-[#8B4513]/10 mx-1" />

        <MenuButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive("blockquote")}
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-[#8B4513]/10 mx-1" />

        <MenuButton onClick={() => editor?.chain().focus().undo().run()}>
          <Undo className="w-4 h-4" />
        </MenuButton>

        <MenuButton onClick={() => editor?.chain().focus().redo().run()}>
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>

      <Tiptap
        content={content}
        onChange={onChange}
        placeholder="Write your thoughts here..."
        onEditorReady={handleEditorReady}
      />
    </div>
  );
}
