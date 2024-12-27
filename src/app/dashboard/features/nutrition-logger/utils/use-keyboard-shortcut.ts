"use client";

import { useEffect } from "react";

interface Options {
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export default function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: Options = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === !!options.ctrlKey &&
        event.altKey === !!options.altKey &&
        event.shiftKey === !!options.shiftKey
      ) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options]);
}
