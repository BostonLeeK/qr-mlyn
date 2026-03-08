export function SegmentedBackground({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 flex max-md:px-2  px-20 gap-2 ${className ?? ""}`}>
      <div className="h-full min-w-0 flex-10 bg-bg-dark" />
      <div className="h-full min-w-0 flex-25 bg-bg-dark" />
      <div className="h-full min-w-0 flex-30 bg-bg-dark" />
      <div className="h-full min-w-0 flex-35 bg-bg-dark" />
      <div className="h-full min-w-0 flex-10 bg-bg-dark" />
    </div>
  );
}
