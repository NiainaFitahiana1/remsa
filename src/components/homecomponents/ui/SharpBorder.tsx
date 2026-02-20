interface SharpBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const SharpBorder = ({ children, className = '' }: SharpBorderProps) => {
  return <div className={`sharp-border ${className}`}>{children}</div>;
};