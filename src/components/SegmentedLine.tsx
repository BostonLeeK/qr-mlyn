export function SegmentedLine({ className }: { className?: string }) {
  return (
    <div className={`flex w-full items-center max-md:px-2  px-20 gap-2 max-md:h-2 h-3 ${className ?? ""}`}>
      <div className="h-full min-w-0 flex-10 bg-text" />
      <div className="h-full min-w-0 flex-25 bg-text" />
      <div className="h-full min-w-0 flex-30 bg-text" />
      <div className="h-full min-w-0 flex-35 bg-text" />
      <div className="h-full min-w-0 flex-10 bg-text" />
    </div>
  );
}
