import { Newsletter } from '../blog/Newsletter';

export const NewsletterSection = () => {
  return (
    <section className="bg-secondary-blue py-24 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-20" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
          Never Miss A <span className="text-accent-yellow italic">Critical</span> Update
        </h2>

        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-medium">
          Get the latest industry reports, technology deep-dives, and DeliverFlow news directly in
          your inbox. No fluff, just logistics.
        </p>

        <Newsletter />

        <p className="text-[10px] text-slate-500 mt-6 uppercase font-bold tracking-widest">
          By subscribing, you agree to our privacy policy and terms of service.
        </p>
      </div>
    </section>
  );
};