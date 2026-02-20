import { LogoDeliverFlow } from '@/components/homecomponents/auth/LogoDeliverFlow';
import { LoginForm } from '@/components/homecomponents/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-custom p-4 font-display dark:bg-background-dark">
      <LogoDeliverFlow />

      <div className="mt-8 w-full max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8 flex gap-6 text-[11px] font-medium uppercase tracking-widest text-slate-400">
        <a href="#" className="hover:text-navy transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-navy transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-navy transition-colors">Support</a>
      </div>

      {/* Illustration décorative (optionnelle) */}
      <div className="fixed bottom-0 right-0 hidden p-8 opacity-10 lg:block pointer-events-none">
        <span className="material-symbols-outlined text-[200px] text-navy">route</span>
      </div>
    </div>
  );
}