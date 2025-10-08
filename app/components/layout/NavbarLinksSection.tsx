import { navbarLinks, navigation } from "~/constants";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui";
import { Link } from "react-router";
import { LinkItem } from "./LinkItem";
import type { NavbarLink } from "~/types/general";
import { useMemo } from "react";
import { useAuthStore } from "~/store";
import { filterNavbarLinksByAccess } from "~/lib";

interface Props {
  isSidebar: boolean;
}

const hasChildren = (item: NavbarLink) => {
  return item.child && item.child.length > 0;
};

export const NavbarLinksSection = ({ isSidebar }: Props) => {
  const components = useMemo(
    () => ({
      Item: isSidebar ? SidebarMenuItem : NavigationMenuItem,
      Trigger: isSidebar ? SidebarMenuButton : NavigationMenuTrigger,
      Content: isSidebar ? SidebarMenuSub : NavigationMenuContent,
      Link: isSidebar ? SidebarMenuButton : NavigationMenuLink,
      SubItem: isSidebar ? SidebarMenuSubItem : "li",
      SubLink: isSidebar ? SidebarMenuSubButton : NavigationMenuLink,
    }),
    [isSidebar]
  );

  const { roles } = useAuthStore();

  return filterNavbarLinksByAccess(navbarLinks, roles ?? []).map((value) => (
    <components.Item key={value.i18nTextKey} className="list-none">
      {hasChildren(value) ? (
        <>
          <components.Trigger
            {...(isSidebar && { disabled: value.link == null })}
          >
            <LinkItem item={value} />
          </components.Trigger>
          <components.Content>
            <ul>
              {value.child!.map((item) => (
                <components.SubItem key={item.i18nTextKey}>
                  <components.SubLink
                    className={isSidebar ? "h-auto py-2" : ""}
                    asChild
                  >
                    <Link to={item.link ?? navigation.home}>
                      <LinkItem item={item} />
                    </Link>
                  </components.SubLink>
                </components.SubItem>
              ))}
            </ul>
          </components.Content>
        </>
      ) : (
        <components.Link
          asChild
          {...(!isSidebar && { className: navigationMenuTriggerStyle() })}
        >
          <Link to={value.link ?? navigation.home}>
            <LinkItem item={value} />
          </Link>
        </components.Link>
      )}
    </components.Item>
  ));
};
