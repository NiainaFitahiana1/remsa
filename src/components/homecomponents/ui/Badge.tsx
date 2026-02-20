interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'featured' | 'category';
  className?: string;
}

const variantStyles = {
  default: 'bg-white text-secondary-blue',
  featured: 'bg-accent-yellow text-secondary-blue',
  category: 'bg-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-secondary-blue',
};

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center rounded-sm 
        font-black uppercase tracking-tighter 
        ${variantStyles[variant] ?? variantStyles.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
};