import {
  ExtendedRoleEnum,
  type ExtendedRoleType,
  type NavbarLink,
  type RoleType,
} from "~/types/general";

export const filterNavbarLinksByAccess = (
  links: NavbarLink[],
  userRoles: RoleType[]
): NavbarLink[] => {
  const hasAccess = (requiredRoles?: ExtendedRoleType[]): boolean => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (
      requiredRoles.includes(ExtendedRoleEnum.AUTHENTICATED) &&
      userRoles.length > 0
    )
      return true;
    return requiredRoles.some((role) => userRoles.includes(role as RoleType));
  };

  return links
    .filter((link) => hasAccess(link.access))
    .map((link) => ({
      ...link,
      child: link.child
        ? filterNavbarLinksByAccess(link.child, userRoles)
        : null,
    }))
    .filter((link) => {
      if (link.child && link.child.length === 0) {
        return !!link.link;
      }
      return true;
    });
};
