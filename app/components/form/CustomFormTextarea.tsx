import { Textarea } from "../ui";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface Props extends React.ComponentProps<"textarea"> {
  name: string;
  label: string;
  type?: string;
  description?: string;
}

export const CustomFormTextarea = ({
  name,
  label,
  description,
  ...props
}: Props) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea {...props} {...field} />
          </FormControl>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
