'use client';

import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';

export default function Greeting() {
  const { profile, loading } = useUserProfile();

  if (loading || !profile) {
    return <GreetingSkeleton />;
  }

  return (
    <div>
      <p className="text-secondary text-2xl lg:text-3xl font-bold tracking-tight">
        Hello, {profile.nom}!
      </p>

      <div className="flex items-center gap-3 mt-2">
        {/* <span className="bg-secondary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
          Level 4 Courier
        </span> */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <p className="text-muted-foreground text-sm font-medium">Active Now</p>
        </div>
      </div>
    </div>
  );
}

function GreetingSkeleton() {
  return (
    <div>
      {/* Titre */}
      <Skeleton className="h-9 w-64 lg:w-80 rounded-md" />

      {/* Badges et statut */}
      <div className="flex items-center gap-3 mt-3">
        <Skeleton className="h-6 w-36 rounded" />
        
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}