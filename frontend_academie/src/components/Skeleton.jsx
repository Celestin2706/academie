export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-5 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 h-3 w-full rounded bg-slate-200" />
      <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
      <div className="mt-4 h-3 w-1/4 rounded bg-slate-200" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="h-4 w-1/2 rounded bg-slate-200" />
      <div className="h-4 w-16 rounded-full bg-slate-200" />
    </div>
  );
}