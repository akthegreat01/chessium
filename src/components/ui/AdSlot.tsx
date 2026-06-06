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

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing children first
    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.background = 'transparent';
    
    // Set initial layout height guesses
    if (format === 'horizontal') {
      iframe.style.height = '90px';
      iframe.height = '90';
    } else {
      iframe.style.height = '300px';
      iframe.style.width = '160px';
      iframe.height = '300';
      iframe.width = '160';
    }

    const iframeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              overflow: hidden;
              background-color: transparent;
            }
          </style>
        </head>
        <body>
          ${format === 'horizontal' ? `
            <div id="container-f82287c5194fdd874e49ad0f4b4e5e52" style="width:100%;"></div>
            <script type="text/javascript" data-cfasync="false" src="https://pl29646499.effectivecpmnetwork.com/f82287c5194fdd874e49ad0f4b4e5e52/invoke.js" async></script>
          ` : `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
              <script type="text/javascript">
                atOptions = {
                  'key' : 'ad3cfe7df1fc9774403752b49e0948d6',
                  'format' : 'iframe',
                  'height' : 300,
                  'width' : 160,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highperformanceformat.com/ad3cfe7df1fc9774403752b49e0948d6/invoke.js"></script>
            </div>
          `}
        </body>
      </html>
    `;

    iframe.srcdoc = iframeHtml;
    containerRef.current.appendChild(iframe);

    // Loop to dynamically adjust iframe height to match ad content height
    const adjustHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          const bodyHeight = doc.body.scrollHeight;
          const container = doc.getElementById('container-f82287c5194fdd874e49ad0f4b4e5e52');
          const contentHeight = container ? container.scrollHeight : bodyHeight;
          const targetHeight = Math.max(bodyHeight, contentHeight);

          if (targetHeight > 0 && Math.abs(targetHeight - parseInt(iframe.style.height)) > 5) {
            iframe.style.height = `${targetHeight}px`;
            iframe.height = `${targetHeight}`;
          }
        }
      } catch (e) {
        // Ignore cross-origin error security flags if scripts do redirects
      }
    };

    const intervalId = setInterval(adjustHeight, 500);

    return () => {
      clearInterval(intervalId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
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
