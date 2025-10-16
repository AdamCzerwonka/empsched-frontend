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
  label: string;
  type?: string;
}

export const CustomFormField = ({ name, label, ...props }: Props) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
