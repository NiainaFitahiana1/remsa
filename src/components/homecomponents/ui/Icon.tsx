interface IconProps {
  name: string;
  className?: string;
  size?: string;
}

export const Icon = ({ name, className = '', size = 'text-2xl' }: IconProps) => {
  return <span className={`material-symbols-outlined ${size} ${className}`}>{name}</span>;
};