import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file InputField.tsx
 *
 * @description This file contains the `InputField` component, which is a reusable input field with a label and optional unit.
 * It uses framer-motion for subtle hover and tap animations.
 *
 * @module InputField
 */

// Define the props interface for the InputField component
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  type?: string;
}

/**
 * InputField component - a reusable input field with a label and optional unit.
 * Uses framer-motion for subtle hover and tap animations.
 *
 * @param {InputFieldProps} props - The component props.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.name - The name attribute for the input field.
 * @param {string} props.value - The current value of the input field.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - The event handler for input changes.
 * @param {string} [props.unit] - The unit of measurement for the input value (optional).
 * @param {string} [props.type="text"] - The type of the input field (optional, defaults to "text").
 * @returns {React.ReactElement} The InputField component.
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  unit,
  type = 'text',
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative">
      <label className="block mb-2 text-gray-700 dark:text-gray-300">
        {/* Display the label and unit if provided */}
        {label} {unit && <span className="text-sm text-gray-500">({unit})</span>}:
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
        />
      </label>
    </motion.div>
  );
};
