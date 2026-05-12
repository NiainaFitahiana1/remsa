import { UserProfile } from '@/types';
import Image from 'next/image';
import logo from '@/../public/logos/logo-text.png';
type SidebarProfileProps = {
  profile: UserProfile;
};

export function SidebarProfile({ profile }: SidebarProfileProps) {
  const role = profile.role.toUpperCase();

  return (
    <div className="p-5 border-b border-border">
      <div className="flex items-center gap-3">
        <div>
          {/* <p className="font-bold text-secondary text-lg">
            Atero 
          </p> */}

          <Image src={logo} alt="Logo" className='size-24'/>
          <span className="bg-secondary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            ESPACE {role}
          </span>
        </div>
      </div>
    </div>
  );
}