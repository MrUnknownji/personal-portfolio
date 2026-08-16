const HireBadge = () => {
  return (
    <div className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-[#111] px-5 py-2.5 transition-[border-color,background-color] hover:border-primary/50 hover:bg-primary/5">
      <span className="relative flex size-2 shrink-0 items-center justify-center" aria-hidden="true">
        <span className="size-2 rounded-full bg-primary" />
      </span>
      <span className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/85">
        Available For Hire
      </span>
    </div>
  );
};

export default HireBadge;
