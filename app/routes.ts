import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { navigation } from "./constants";

export default [
  layout("./components/layout/GlobalLayout.tsx", [
    route(navigation.signIn, "./routes/auth/SignInPage.tsx"),
    route(navigation.signUp, "./routes/auth/signUp/SignUpPage.tsx"),
    route(navigation.logout, "./routes/auth/LogoutPage.tsx"),
    layout("./components/layout/Layout.tsx", [index("routes/HomePage.tsx")]),
  ]),
] satisfies RouteConfig;
