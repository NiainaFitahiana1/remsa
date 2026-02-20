import { ArticleCard } from '../blog/ArticleCard';
import { StatsCard } from '../blog/StatsCard';
import type { ArticleCardProps } from '../blog/ArticleCard';

interface ArticlesGridProps {
  posts: ArticleCardProps[];
}

export const ArticlesGrid = ({ posts }: ArticlesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {posts.map((post, index) => (
        <div key={index}>
          {index === 3 ? <StatsCard /> : <ArticleCard {...post} />}
        </div>
      ))}
    </div>
  );
};