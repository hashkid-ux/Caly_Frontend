/**
 * Accessibility Utilities
 * Helpers for WCAG 2.1 AA compliance
 */

// Focus management
export const focusElement = (element) => {
  if (element) {
    setTimeout(() => element.focus(), 0);
  }
};

export const getFocusableElements = (container = document) => {
  return container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
};

export const trapFocus = (event, container) => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
};

// Keyboard shortcuts
export const useKeyboardShortcut = (key, callback, modifiers = {}) => {
  const handleKeyDown = (event) => {
    const { ctrlKey = false, shiftKey = false, altKey = false } = modifiers;

    if (
      event.key.toLowerCase() === key.toLowerCase() &&
      event.ctrlKey === ctrlKey &&
      event.shiftKey === shiftKey &&
      event.altKey === altKey
    ) {
      event.preventDefault();
      callback(event);
    }
  };

  return handleKeyDown;
};

// Announce to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Hidden but announced
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => announcement.remove(), 1000);
};

// Color contrast checker (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
export const calculateContrastRatio = (color1, color2) => {
  const getLuminance = (hexColor) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    const rl = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gl = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bl = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Debounce for accessibility events
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Skip link for keyboard navigation
export const createSkipLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
};

// Check if element is in viewport (for lazy loading)
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
};

// Generate unique IDs for form labels and ARIA attributes
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};
