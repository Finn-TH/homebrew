"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface TiptapProps {
  content: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  onEditorReady?: (editor: Editor) => void;
}

const Tiptap = ({
  content,
  onChange,
  placeholder = "Start writing...",
  onEditorReady,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose journal-prose max-w-none focus:outline-none min-h-[200px] px-4 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      onEditorReady?.(editor);
    },
    autofocus: "end",
    editable: true,
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
