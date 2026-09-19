'use client';

import { useEffect } from 'react';

/**
 * FormValidationSuppressor
 * Suppresses default browser constraint validation bubbles (e.g. "Please fill out this field")
 * site-wide so that bespoke, styled inline validation and toasts take precedence.
 */
export function FormValidationSuppressor() {
  useEffect(() => {
    const handleInvalid = (e: Event) => {
      e.preventDefault();
    };

    // Capture phase listener to prevent native tooltips on any form element
    document.addEventListener('invalid', handleInvalid, true);
    return () => {
      document.removeEventListener('invalid', handleInvalid, true);
    };
  }, []);

  return null;
}
