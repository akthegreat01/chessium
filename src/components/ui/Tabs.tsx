'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Tabs({
  items,
  defaultValue,
  onChange,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultValue ?? items[0]?.value ?? ''
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  const activeContent = items.find((item) => item.value === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab headers */}
      <div className="relative flex gap-1 rounded-xl border border-border bg-bg-tertiary p-1">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => handleTabChange(item.value)}
            className={`
              relative z-10 flex items-center gap-2 rounded-lg px-4 py-2
              text-sm font-medium transition-colors duration-200
              ${
                activeTab === item.value
                  ? 'text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
              }
            `}
          >
            {activeTab === item.value && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg bg-bg-card border border-border/50 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            {item.icon && <span className="relative z-10">{item.icon}</span>}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4"
      >
        {activeContent}
      </motion.div>
    </div>
  );
}
