'use client';

import { SidebarProfile } from './sidebar/SidebarProfile';
import { SidebarNav } from './sidebar/SidebarNav';
import { SidebarLogout } from './sidebar/SidebarLogout';
import { menuLinks } from '@/data/menuLinks';
import { Role } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function Sidebar() {
  const { profile, loading } = useUserProfile();

  if (loading || !profile) {
    return <SidebarSkeleton />;
  }

  const role = profile.role.toUpperCase() as Role;
  const links = menuLinks[role] || [];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-border lg:z-50 lg:overflow-y-auto">
      <SidebarProfile profile={profile} />
      <SidebarNav links={links} />
      <SidebarLogout />
    </aside>
  );
}

// Skeleton
function SidebarSkeleton() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:border-r lg:border-border lg:z-50 lg:overflow-y-auto">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-28 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}