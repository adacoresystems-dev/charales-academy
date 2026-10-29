import { useEffect, useState } from 'react';

export function Avatar({ src, name, className = 'w-10 h-10' }: { src?: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const initials = name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  return src && !failed
    ? <img src={src.replace(/^\/public\//, '/')} alt={name} onError={() => setFailed(true)} className={`object-cover rounded-xl shrink-0 ${className}`} />
    : <span role="img" aria-label={name} className={`inline-flex items-center justify-center rounded-xl shrink-0 bg-blue-50 text-[#3B59A8] text-xs font-extrabold ${className}`}>{initials}</span>;
}
