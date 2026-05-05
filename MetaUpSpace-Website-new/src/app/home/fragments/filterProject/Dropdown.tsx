'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownSelectorProps {
  options?: DropdownOption[];
  defaultValue?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  options = [
    { value: 'retail', label: 'Retail', icon: '🛍️' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'sales', label: 'Sales', icon: '💼' },
    { value: 'government', label: 'Government', icon: '🏛️' },
    { value: 'event', label: 'Event', icon: '📅' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'influencer', label: 'Influencer Marketing', icon: '📱' },
    { value: 'media', label: 'Media', icon: '📺' },
    { value: 'digital', label: 'Digital Twin', icon: '🔄' },
  ],
  defaultValue,
  placeholder = "Solutions",
  onSelect,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onSelect?.(value);
  };

  return (
    <div className={`relative w-full flex justify-center  ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-3 px-6 py-3 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white font-medium text-sm min-w-[140px] transition-all duration-200 hover:bg-gray-700/90 hover:border-gray-600/50"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon && (
            <span className="text-base">{selectedOption.icon}</span>
          )}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white text-sm font-medium hover:bg-gray-700/50 transition-colors duration-150"
                >
                  {option.icon && (
                    <span className="text-base flex-shrink-0">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DropdownSelector;
