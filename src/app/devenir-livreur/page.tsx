"use client";

import CourierRegistrationForm from "@/components/homecomponents/auth/CourierRegistrationForm";

const Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4 font-display">
      <div className="mt-8 w-full max-w-4xl">
        <CourierRegistrationForm />
      </div>

      {/* Footer links */}
      <div className="mt-10 flex gap-6 text-[11px] font-medium uppercase tracking-widest text-slate-400">
        <a href="#" className="hover:text-red-700 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-red-700 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-red-700 transition-colors">Fleet Contact</a>
      </div>
    </div>
  );
};

export default Page;