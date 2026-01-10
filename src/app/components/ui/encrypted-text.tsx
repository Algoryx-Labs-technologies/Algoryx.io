"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export function EncryptedText({
  text,
  encryptedClassName,
  revealedClassName,
  revealDelayMs = 50,
  className,
}: EncryptedTextProps) {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [displayText, setDisplayText] = useState<string[]>(
    text.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  useEffect(() => {
    if (revealedIndices.size >= text.length) return;

    const interval = setInterval(() => {
      setRevealedIndices((prev) => {
        const next = new Set(prev);
        if (next.size < text.length) {
          next.add(next.size);
        }
        return next;
      });
    }, revealDelayMs);

    return () => clearInterval(interval);
  }, [text.length, revealDelayMs, revealedIndices.size]);

  useEffect(() => {
    setDisplayText((prev) => {
      return text.split("").map((char, index) => {
        if (revealedIndices.has(index)) {
          return char;
        }
        if (char === " ") {
          return " ";
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
    });
  }, [text, revealedIndices]);

  return (
    <span className={className}>
      {displayText.map((char, index) => (
        <span
          key={index}
          className={cn(
            revealedIndices.has(index) ? revealedClassName : encryptedClassName,
            char === " " && "inline-block w-2"
          )}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

