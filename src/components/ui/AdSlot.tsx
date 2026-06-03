'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'square';
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: { push: (args: Record<string, unknown>) => void }[];
  }
}

export default function AdSlot({
  slot = 'default',
  format = 'auto',
  className = '',
  responsive = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdSenseLoaded = typeof window !== 'undefined' && window.adsbygoogle;
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  const mappedFormat = format === 'square' ? 'rectangle' : format;

  useEffect(() => {
    if (clientId && isAdSenseLoaded) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        (window as any).adsbygoogle = adsbygoogle;
      } catch {
        // AdSense may throw if ad was already pushed
      }
    }
  }, [clientId, isAdSenseLoaded]);

  // Show placeholder when AdSense is not configured
  if (!clientId) {
    return (
      <div
        className={`
          flex items-center justify-center
          rounded-xl border border-dashed border-border
          bg-white/[0.02] text-text-muted
          min-h-[90px]
          ${className}
        `}
      >
        <div className="flex items-center gap-2 text-xs">
          <svg className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
          <span>Ad</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={mappedFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
