export default function Spinner({ label = 'Chargement...', fullScreen = false }) {
  const content = (
    <div
      className="flex flex-col items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return <div className="flex justify-center py-16">{content}</div>;
}