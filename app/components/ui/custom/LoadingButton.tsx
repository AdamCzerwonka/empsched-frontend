import { Button, buttonVariants } from "~/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { Spinner } from "../spinner";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading: boolean;
}

export const LoadingButton = ({
  children,
  disabled,
  isLoading,
  ...props
}: Props) => {
  return (
    <Button {...props} disabled={isLoading || disabled}>
      {isLoading && <Spinner />}
      {children}
    </Button>
  );
};
