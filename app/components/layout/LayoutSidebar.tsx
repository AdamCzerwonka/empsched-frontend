import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";
import { Logo } from "./Logo";
import { ChevronUp, User } from "lucide-react";
import { accountActions } from "~/constants";
import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "../ui/navigation-menu";

export const LayoutSidebar = () => {
  const { t } = useTranslation("layout/navbar");

  return (
    <Sidebar side={"right"}>
      <SidebarHeader className="flex flex-row items-center justify-between p-3">
        <Logo />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer" asChild>
                <SidebarMenuButton>
                  <User /> {t("myAccount")}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end">
                {accountActions.map((item) => (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    key={item.i18nKey}
                    asChild
                  >
                    <Link to={item.link}>
                      <span className="flex min-w-max items-center gap-2">
                        {<item.icon />}
                        {t(item.i18nKey)}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
