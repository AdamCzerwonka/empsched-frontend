import { Button, buttonVariants } from "~/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { Spinner } from "../spinner";

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
      {isLoading && <Spinner />}
      {children}
    </Button>
  );
};
