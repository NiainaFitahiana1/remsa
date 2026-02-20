export interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: string;
  image: string;
  imageAlt?: string;
  className?: string;
}

export const ArticleCard = ({
  title,
  excerpt,
  date,
  readTime,
  category,
  image,
  imageAlt = title,
  className = '',
}: ArticleCardProps) => {
  return (
    <article className={`group cursor-pointer ${className}`}>
      <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm bg-slate-100 sharp-border">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-sm bg-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-secondary-blue">
            {category}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <time dateTime={date}>{date}</time>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{readTime} min read</span>
        </div>

        <h3 className="text-2xl font-extrabold leading-tight uppercase text-secondary-blue transition-colors group-hover:text-primary dark:text-slate-100">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {excerpt}
        </p>
      </div>
    </article>
  );
};