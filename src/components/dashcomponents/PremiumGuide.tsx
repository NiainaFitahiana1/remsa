export default function PremiumGuide() {
  return (
    <div className="mt-6 px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-xl bg-secondary p-6 lg:p-8 border-l-4 border-accent shadow-xl">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-accent text-2xl">auto_awesome</span>
            <p className="text-accent text-xs lg:text-sm font-bold uppercase tracking-widest">
              Premium Courier Guide
            </p>
          </div>
          <h3 className="text-primary-foreground text-xl lg:text-2xl font-bold mb-3 leading-tight">
            Master the Peak Hours
          </h3>
          <p className="text-primary-foreground/85 text-sm lg:text-base mb-6 leading-relaxed">
            Strategy insights from top-performing couriers – boost your earnings during rush hours.
          </p>
          <button className="bg-accent text-secondary px-6 py-3 rounded-lg text-sm lg:text-base font-bold shadow-md hover:scale-105 transition-transform uppercase tracking-wider">
            Access Tips
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <span className="material-symbols-outlined text-[180px] text-primary-foreground">insights</span>
        </div>
      </div>
    </div>
  );
}