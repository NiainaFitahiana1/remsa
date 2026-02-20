export const Newsletter = () => {
  return (
    <form className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto">
      <input
        className="
          flex-1 bg-white border-none px-6 py-5 text-sm font-bold 
          placeholder:text-slate-400 focus:ring-2 focus:ring-primary 
          rounded-l-sm rounded-r-none uppercase tracking-widest outline-none
        "
        placeholder="YOUR@EMAIL.COM"
        type="email"
        required
      />
      <button
        className="
          bg-primary hover:bg-red-600 text-white px-10 py-5 text-sm 
          font-black uppercase tracking-widest transition-all rounded-r-sm
        "
        type="submit"
      >
        Subscribe Now
      </button>
    </form>
  );
};