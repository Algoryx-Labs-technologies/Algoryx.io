"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
  revealMode?: "sequential" | "parallel";
  scrambleDurationMs?: number;
  scrambleTickMs?: number;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

function randomGlyph(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function scrambleText(text: string): string[] {
  return text.split("").map((char) => {
    if (char === " ") return " ";
    return randomGlyph();
  });
}

export function EncryptedText({
  text,
  encryptedClassName,
  revealedClassName,
  revealDelayMs = 50,
  revealMode = "sequential",
  scrambleDurationMs = 320,
  scrambleTickMs = 35,
  className,
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(() => scrambleText(text));
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setIsRevealed(false);
    setDisplayText(scrambleText(text));

    if (revealMode === "parallel") {
      const scrambleInterval = setInterval(() => {
        setDisplayText(scrambleText(text));
      }, scrambleTickMs);

      const revealTimeout = setTimeout(() => {
        clearInterval(scrambleInterval);
        setDisplayText(text.split(""));
        setIsRevealed(true);
      }, scrambleDurationMs);

      return () => {
        clearInterval(scrambleInterval);
        clearTimeout(revealTimeout);
      };
    }

    let revealedCount = 0;
    const interval = setInterval(() => {
      revealedCount += 1;
      if (revealedCount >= text.length) {
        setDisplayText(text.split(""));
        setIsRevealed(true);
        clearInterval(interval);
        return;
      }

      setDisplayText(
        text.split("").map((char, index) => {
          if (index < revealedCount) return char;
          if (char === " ") return " ";
          return randomGlyph();
        })
      );
    }, revealDelayMs);

    return () => clearInterval(interval);
  }, [text, revealMode, revealDelayMs, scrambleDurationMs, scrambleTickMs]);

  return (
    <span className={className}>
      {displayText.map((char, index) => (
        <span
          key={`${index}-${char}`}
          className={cn(
            isRevealed ? revealedClassName : encryptedClassName,
            char === " " && "inline-block w-2"
          )}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
