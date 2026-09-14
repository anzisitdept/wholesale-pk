'use client';

import React from 'react';
import { useStoreData } from '@/context/StoreDataContext';

export default function TopBar() {
  const { storeContent } = useStoreData();
  const messages = storeContent.topBarMessages;

  if (messages.length === 0) return null;

  // Duplicate the set exactly twice so the -50% shift loops seamlessly
  const items = messages.length === 1 ? [messages[0], messages[0]] : [...messages, ...messages];
  const duration = Math.max(10, items.length * 2.5);

  return (
    <div className="bg-[#6f0c07] text-white border-b border-[#580a06] text-xs md:text-[13px] font-bold py-2 md:py-2.5 overflow-hidden select-none font-display">
      <div
        className="flex items-center whitespace-nowrap animate-marquee w-max"
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((msg, i) => (
          <span
            key={i}
            className="inline-block tracking-wider uppercase text-[10px] md:text-[12px] font-black text-white/95 px-10"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}