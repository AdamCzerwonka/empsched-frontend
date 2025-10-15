import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "..";

interface Props {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const BaseEmpty = ({ icon, title, description, children }: Props) => {
  return (
    <Empty>
      <EmptyHeader>
        {icon && <EmptyMedia variant={"icon"}>{icon}</EmptyMedia>}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  );
};
