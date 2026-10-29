import { Info } from 'lucide-react';
export function DemoNotice() {
  return <div role="status" className="flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-900">
    <Info className="w-4 h-4 shrink-0 mt-0.5" />
    <p><strong>Modo demostración.</strong> El acceso es real; los módulos muestran ejemplos y sus cambios solo se guardan en este navegador.</p>
  </div>;
}
