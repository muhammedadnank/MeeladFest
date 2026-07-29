export function OfficialChip({ label = 'Official Page' }: { label?: string }) {
  return (
    <span className="bg-gold-500/20 border border-gold-500/40 text-gold-200 text-[10px] font-semibold tracking-widest uppercase rounded-full px-2.5 py-1">
      {label}
    </span>
  );
}
