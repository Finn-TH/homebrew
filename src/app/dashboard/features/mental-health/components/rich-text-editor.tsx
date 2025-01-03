"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { Bold, Italic } from "lucide-react";
import "../styles/journal.css";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const WORD_LIMIT = 500;

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Placeholder.configure({
        placeholder: "Share your thoughts for today...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        includeChildren: false,
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty",
      }),
      CharacterCount,
      BubbleMenuExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "tiptap prose journal-prose max-w-none focus:outline-none min-h-[200px] px-4 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const characters = editor?.storage?.characterCount?.characters?.() ?? 0;
  const words = editor?.storage?.characterCount?.words?.() ?? 0;
  const isOverLimit = words > WORD_LIMIT;

  return (
    <div className="border border-[#8B4513]/10 rounded-lg overflow-hidden bg-white">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150 }}
          className="flex overflow-hidden bg-white rounded-lg shadow-lg border border-[#8B4513]/10"
          shouldShow={({ editor, from, to }) => {
            // Only show menu when text is selected
            return from !== to;
          }}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 transition-colors hover:bg-[#8B4513]/5 ${
              editor.isActive("bold") ? "text-[#8B4513]" : "text-[#8B4513]/60"
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 transition-colors hover:bg-[#8B4513]/5 ${
              editor.isActive("italic") ? "text-[#8B4513]" : "text-[#8B4513]/60"
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}

      <div className="flex items-center justify-end gap-3 p-2 border-b border-[#8B4513]/10 text-sm text-[#8B4513]/60">
        <span>{characters} characters</span>
        <span className={isOverLimit ? "text-red-500" : ""}>
          {words}/{WORD_LIMIT} words
        </span>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
