"use client";

import { useEffect, useState } from "react";

export function useTypewriter(text: string, enabled: boolean, speed = 32) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let index = 0;
    const id = window.setInterval(() => {
      setValue(text.slice(0, index));
      index += 1;
      if (index >= text.length) {
        window.clearInterval(id);
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [enabled, speed, text]);

  return value;
}

