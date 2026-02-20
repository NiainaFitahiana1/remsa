export const LogoDeliverFlow = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded bg-primary p-1.5">
          <span className="material-symbols-outlined text-2xl text-white">local_shipping</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-navy dark:text-slate-100">
          DeliverFlow
        </h1>
      </div>
      <div className="h-1 w-12 rounded-full bg-sun" />
    </div>
  );
};