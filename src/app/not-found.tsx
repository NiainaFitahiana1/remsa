import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center text-neutral-800 px-4">
      <div className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium mb-4 shadow-sm">
        Oops !
      </div>

      <h1 className="text-6xl font-extrabold tracking-tight mb-3">
        404
      </h1>

      <p className="text-lg text-neutral-600 mb-8 text-center max-w-md">
        La page que vous cherchez est introuvable ou a été déplacée.
      </p>

      <Button asChild>
        <Link href="/">Home</Link>
      </Button>
    </main>
  );
}
