'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'square';
  className?: string;
  responsive?: boolean;
}

/**
 * Adsterra Ad Slot Component
 * 
 * Renders different Adsterra ad formats based on the `format` prop:
 * - rectangle/square/auto: 160x300 Banner ad
 * - horizontal: Native Banner ad
 * - vertical: 160x300 Banner ad
 */
export default function AdSlot({
  slot = 'default',
  format = 'auto',
  className = '',
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current || scriptLoaded.current) return;
    scriptLoaded.current = true;

    if (format === 'horizontal') {
      // Native Banner — async script + div container
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl29646499.effectivecpmnetwork.com/f82287c5194fdd874e49ad0f4b4e5e52/invoke.js';
      
      const div = document.createElement('div');
      div.id = `container-f82287c5194fdd874e49ad0f4b4e5e52`;
      
      containerRef.current.appendChild(div);
      containerRef.current.appendChild(script);
    } else {
      // 160x300 Banner — script config + invoke
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.text = `
        atOptions = {
          'key' : 'ad3cfe7df1fc9774403752b49e0948d6',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/ad3cfe7df1fc9774403752b49e0948d6/invoke.js';

      containerRef.current.appendChild(configScript);
      containerRef.current.appendChild(invokeScript);
    }
  }, [format]);

  return (
    <div
      ref={containerRef}
      className={`
        flex items-center justify-center
        overflow-hidden
        ${format === 'horizontal' ? 'w-full min-h-[90px]' : 'min-h-[300px] w-[160px] mx-auto'}
        ${className}
      `}
    />
  );
}
