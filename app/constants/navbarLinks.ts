import type { NavbarLink } from "~/types/general";
import { navigation } from "./navigation";

// example navbarLink
// {
//   i18nTextKey: "template",
//   i18nDescriptionKey: null,
//   link: navigation.home,
//   icon: HomeIcon,
//   access: [],
//   child: [
//     {
//       i18nTextKey: "main page",
//       i18nDescriptionKey: "main page is accessible to all users",
//       link: navigation.home,
//       icon: Axis3d,
//       access: [],
//       child: null,
//     },
//     {
//       i18nTextKey: "sign up",
//       i18nDescriptionKey: "sign up is accessible to all users",
//       link: navigation.signUp,
//       icon: SettingsIcon,
//       access: [],
//       child: null,
//     },
//     {
//       i18nTextKey: "sign in",
//       i18nDescriptionKey: "sign in is accessible to all users",
//       link: navigation.signIn,
//       icon: SettingsIcon,
//       access: [],
//       child: null,
//     },
//   ],
// },

export const navbarLinks: NavbarLink[] = [];
