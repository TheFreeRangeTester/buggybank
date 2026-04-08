export const LoadingState = ({ message = "Cargando..." }: { message?: string }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
};
