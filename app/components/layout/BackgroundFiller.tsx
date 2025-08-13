import { cn } from "~/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const BackgroundFiller = ({ className = "", ...props }: Props) => {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-[url('/assets/floating-cogs.svg')] bg-repeat",
        className
      )}
      style={{ backgroundSize: "800px 800px" }}
      {...props}
    />
  );
};
