import type { RefAttributes } from "react";
import { Link, type LinkProps } from "react-router";

interface Props
  extends Omit<LinkProps, "to">,
    RefAttributes<HTMLAnchorElement> {
  to?: LinkProps["to"];
}

export const Logo = ({ to, ...linkProps }: Props) => {
  return (
    <Link to={to ?? "/"} {...linkProps}>
      Employee<span className="font-bold">Scheduler</span>
    </Link>
  );
};

export default Logo;
