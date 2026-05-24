import React from 'react';

const URL_REGEX = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g;

export function MessageTextWithLinks({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_REGEX.source, 'g');

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    parts.push(
      <a
        key={`${match.index}-${url}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200 break-all"
      >
        {url.replace(/^https?:\/\//, '')}
      </a>
    );
    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts.length > 0 ? parts : text}</>;
}
