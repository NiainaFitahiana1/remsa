import { Button } from '../ui/Button';
import type { ButtonProps } from '../ui/Button';

interface LoadMoreButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  children?: string;
}

export const LoadMoreButton = ({
  children = 'View Older Insights',
  ...props
}: LoadMoreButtonProps) => {
  return (
    <Button variant="outline" size="xl" {...props}>
      {children}
    </Button>
  );
};