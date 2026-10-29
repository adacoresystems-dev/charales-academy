import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia('(min-width: 768px)');
    if (media.matches) { close.current(); return; }
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const resize = () => { if (media.matches) close.current(); };
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close.current(); }
      if (e.key !== 'Tab') return;
      const elements = panel.current?.querySelectorAll<HTMLElement>('button, a[href], select, input, [tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.current?.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !panel.current?.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    media.addEventListener('change', resize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', keydown);
      media.removeEventListener('change', resize);
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-[100] md:hidden">
    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
    <div ref={panel} role="dialog" aria-modal="true" aria-label="Menú de navegación"
      className="drawer-enter absolute inset-y-0 left-0 w-[min(300px,88vw)] flex flex-col bg-[#111827] shadow-2xl">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white">
        <span className="text-xs font-semibold">Navegación</span>
        <button onClick={onClose} aria-label="Cerrar menú" className="p-2 rounded-lg hover:bg-white/10"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  </div>, document.body);
}
