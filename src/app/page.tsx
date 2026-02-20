import { Button } from "@/components/ui/button";
import { Construction, LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-gradient-to-br from-background to-muted/30">
      <div className="text-center space-y-4">
        <Construction className="h-16 w-16 text-primary mx-auto" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold tracking-tight">En construction</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Cette page est en cours de création. Connectez-vous pour accéder à votre dashboard.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild className="gap-2">
          <Link href="/login">
            <LogIn className="h-5 w-5" />
            Se connecter
          </Link>
        </Button>

        {/* <Button size="lg" variant="secondary" asChild>
          <Link href="/register">S'inscrire</Link>
        </Button> */}
      </div>
    </div>
  );
}