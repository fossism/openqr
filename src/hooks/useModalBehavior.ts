import { useEffect, type RefObject } from 'react';

/**
 * Shared modal behavior: ESC to close, Tab focus trap, body scroll lock,
 * and initial focus on the first interactive element.
 * Must be called unconditionally (before any early return).
 */
export const useModalBehavior = (
  isOpen: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, dialogRef]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('button, input, select, textarea')
        ?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(timer);
    };
  }, [isOpen, dialogRef]);
};
