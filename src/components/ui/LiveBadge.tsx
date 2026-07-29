export function LiveBadge({ label = 'Live Now' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-green-900/30 border border-green-400/40 text-green-300 text-[10px] font-semibold tracking-widest uppercase rounded-full px-2.5 py-1">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
      {label}
    </span>
  );
}
