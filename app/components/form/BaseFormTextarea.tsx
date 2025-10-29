import { Textarea } from "../ui";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui";

interface Props extends React.ComponentProps<"textarea"> {
  name: string;
  label: string;
  type?: string;
  description?: string;
}

export const BaseFormTextarea = ({
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
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
