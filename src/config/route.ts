import { Icons } from "@/components/icons";
import type { RouteTypes } from "@/types/route";

export const routeConfig = [
  {
    path: "/",
    label: "Home",
    icon: Icons.Layout.Navigation.Home,
  },
  {
    path: "/work",
    label: "Work",
    icon: Icons.Layout.Navigation.Work,
  },
  // {
  //   path: "/about",
  //   label: "About",
  //   icon: Icons.Layout.Navigation.About,
  // },
  // {
  //   path: "/contact",
  //   label: "Contact",
  //   icon: Icons.Layout.Navigation.Contact,
  // },
] as const satisfies readonly RouteTypes[];
