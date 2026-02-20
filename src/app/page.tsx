import { Header } from '@/components/homecomponents/layout/Header';
import { Footer } from '@/components/homecomponents/layout/Footer';
import { HeroSection } from '@/components/homecomponents/sections/HeroSection';
import { CategoryFilter } from '@/components/homecomponents/blog/CategoryFilter';
import { ArticlesGrid } from '@/components/homecomponents/sections/ArticlesGrid';
import { NewsletterSection } from '@/components/homecomponents/sections/NewsletterSection';
import { LoadMoreButton } from '@/components/homecomponents/blog/LoadMoreButton';
import type { ArticleCardProps } from '@/components/homecomponents/blog/ArticleCard';

const samplePosts: ArticleCardProps[] = [
  {
    title: 'Optimizing Peak Hour Routes with Predictive AI',
    excerpt:
      'Our new data model predicts traffic bottlenecks before they happen, cutting urban delivery times by an average of 14.5% during rush hour.',
    date: 'June 12, 2024',
    readTime: 5,
    category: 'Fleet',
    image: 'https://images.unsplash.com/photo-1586528116022-7ea2d8a8d6e6?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Machine Learning in the Sorting Hub',
    excerpt:
      'Go behind the scenes of our newest automated sorting facility where robots handle 50,000 packages per hour with 99.9% accuracy.',
    date: 'June 10, 2024',
    readTime: 12,
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Our Commitment to Net Zero by 2030',
    excerpt:
      'Transitioning to a 100% electric vehicle fleet isn’t just a goal—it’s already in motion. See the progress we’ve made this quarter.',
    date: 'June 08, 2024',
    readTime: 4,
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58caa5?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'The Air-Space Challenge: Drone Delivery',
    excerpt:
      'Navigating regulatory hurdles and technological barriers to make doorstep drone delivery an everyday reality.',
    date: 'June 05, 2024',
    readTime: 7,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e47?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Scaling Across Southeast Asia: Lessons Learned',
    excerpt:
      'How localized logistics networks helped us overcome infrastructure challenges in three of the world’s fastest-growing markets.',
    date: 'June 01, 2024',
    readTime: 9,
    category: 'Global',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&auto=format&fit=crop&q=80',
  },
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 selection:bg-primary selection:text-white dark:bg-background-dark dark:text-slate-100">
      <Header />

      <main>
        <HeroSection />

        <CategoryFilter />

        <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <h2 className="mb-10 text-center text-3xl font-black uppercase tracking-tight text-secondary-blue dark:text-slate-100 md:text-4xl lg:mb-12">
            Latest Insights
          </h2>

          <ArticlesGrid posts={samplePosts} />

          <div className="mt-16 flex justify-center lg:mt-20">
            <LoadMoreButton>View Older Insights</LoadMoreButton>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}