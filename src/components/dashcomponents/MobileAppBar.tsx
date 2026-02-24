export default function MobileAppBar() {
  return (
    <header className="lg:hidden flex items-center bg-white p-4 pb-2 justify-between sticky top-0 z-50 border-b border-border">
      <div className="flex items-center gap-3">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-secondary/10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/...')",
          }}
        />
        <h2 className="text-secondary text-lg font-bold uppercase tracking-tight">Dashboard</h2>
      </div>
      <button className="flex items-center justify-center h-10 w-10 text-secondary">
        <span className="material-symbols-outlined">notifications</span>
      </button>
    </header>
  );
}