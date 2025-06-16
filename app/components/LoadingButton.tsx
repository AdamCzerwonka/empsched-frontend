import { Button, buttonVariants } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  disableButton?: boolean;
  isLoading: boolean;
}

export const LoadingButton = ({
  children,
  disableButton,
  isLoading,
  ...props
}: Props) => {
  return (
    <Button {...props} disabled={isLoading || disableButton}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
