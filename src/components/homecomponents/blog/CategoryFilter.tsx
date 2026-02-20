const categories = [
  'All Insight',
  'Fleet Management',
  'Sustainability',
  'Engineering',
  'Global Expansion',
  'Customer Success',
];

export const CategoryFilter = () => {
  return (
    <section className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-8 overflow-x-auto py-6 scrollbar-hide">
          {categories.map((cat, i) => (
            <a
              key={cat}
              href="#"
              className={`
                flex items-center gap-2 whitespace-nowrap text-sm font-black uppercase tracking-widest transition-colors
                ${i === 0 ? 'text-primary' : 'text-slate-400 hover:text-secondary-blue'}
              `}
            >
              {i === 0 && <span className="h-2 w-2 rounded-full bg-primary" />}
              {cat}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};