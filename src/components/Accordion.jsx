import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ items = [], defaultOpen = false, multiple = false }) => {
  const [openItems, setOpenItems] = useState(
    defaultOpen ? items.map((_, idx) => idx) : []
  );

  const toggleItem = (index) => {
    if (multiple) {
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="space-y-2 border border-gray-200 rounded-lg overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openItems.includes(index);
        return (
          <div key={index} className="border-b last:border-b-0">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                {typeof item.content === 'string' ? (
                  <p className="text-gray-700">{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
