import { useTheme } from "../theme-provider";
import { Toaster } from "../ui";

export const ToasterWrapper = () => {
  const { theme } = useTheme();

  return <Toaster theme={theme} richColors />;
};
