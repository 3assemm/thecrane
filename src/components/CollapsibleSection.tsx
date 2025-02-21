import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * @file CollapsibleSection.tsx
 *
 * @description This file contains the `CollapsibleSection` component, which is a reusable component that allows
 * users to expand and collapse a section of content. It uses framer-motion for smooth animations.
 *
 * @module CollapsibleSection
 */

// Interface for the CollapsibleSection component props
interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

/**
 * CollapsibleSection component - a section that can be expanded and collapsed.
 * Uses framer-motion for smooth animations.
 *
 * @param {CollapsibleSectionProps} props - The component props.
 * @param {string} props.title - The title of the section.
 * @param {boolean} [props.defaultExpanded=true] - Whether the section is initially expanded (optional, defaults to true).
 * @param {React.ReactNode} props.children - The content to be displayed within the section.
 * @returns {React.ReactElement} The CollapsibleSection component.
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultExpanded = true,
  children,
}) => {
  // State to track whether the section is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      {/* Section title and expand/collapse button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
        {/* Display appropriate icon based on expanded state */}
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Content area with animation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
