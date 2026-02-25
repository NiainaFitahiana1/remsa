import Image from 'next/image';
import logo from '../../../../public/logos/logo-text.png'

export const LogoDeliverFlow = () => {
  return (
    <div className="flex flex-col items-center gap-3.5 sm:gap-4">
      {/* Le logo image */}
      <div className="relative flex items-center justify-center">
        <Image
          src={logo}
          alt="e-kalité web - logo"
          width={100}          // ← valeur suggérée pour ce style de logo
          height={48}          // ← ajuste selon le ratio réel de ton image
          className="object-contain drop-shadow-md"
          priority             // important si c'est affiché en haut de page
        />
      </div>

      {/* Barre décorative optionnelle – style moderne et léger */}
      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 opacity-80" />
    </div>
  );
};