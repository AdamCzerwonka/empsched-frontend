import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface Props extends React.ComponentProps<"input"> {
  name: string;
  label?: string;
  type?: string;
  description?: string;
}

export const BaseFormField = ({
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
            <Input
              {...field}
              {...props}
              value={props.type === "file" ? undefined : (field.value ?? "")}
            />
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
