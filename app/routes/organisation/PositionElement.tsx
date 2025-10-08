import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui";
import type { Position } from "~/types/general";

interface Props {
  position: Position;
}

export const PositionElement = ({ position }: Props) => {
  return (
    <AccordionItem value={position.id}>
      <AccordionTrigger>{position.name}</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground">{position.description}</p>
      </AccordionContent>
    </AccordionItem>
  );
};
