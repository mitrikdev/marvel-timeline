'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Dialog({
  title,
  children,
  onClose,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const orientationClosing = useRef(false);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const portraitPhone = window.matchMedia('(orientation: portrait) and (max-width: 900px)');
    const syncOrientation = () => {
      if (portraitPhone.matches && dialog.open) {
        orientationClosing.current = true;
        dialog.close();
      } else if (!portraitPhone.matches && !dialog.open) dialog.showModal();
    };
    syncOrientation();
    portraitPhone.addEventListener('change', syncOrientation);
    return () => portraitPhone.removeEventListener('change', syncOrientation);
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onClose={() => {
        if (orientationClosing.current) {
          orientationClosing.current = false;
          return;
        }
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-header">
        <h2>{title}</h2>
        <button className="icon-button" aria-label={`Close ${title}`} onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
