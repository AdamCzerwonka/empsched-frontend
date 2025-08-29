import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";
import { NavigationMenu } from "../ui";
import { NavbarLinksSection } from "./NavbarLinksSection";
import { AccountSection } from "./AccountSection";

export const LayoutSidebar = () => {
  const { t } = useTranslation("layout/navbar");

  return (
    <Sidebar side={"right"}>
      <SidebarHeader className="flex flex-row items-center justify-between p-3">
        <SidebarTrigger closingButton={true} />
        <NavigationMenu className="list-none">
          <AccountSection />
        </NavigationMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavbarLinksSection isSidebar={true} />
      </SidebarContent>
    </Sidebar>
  );
};
