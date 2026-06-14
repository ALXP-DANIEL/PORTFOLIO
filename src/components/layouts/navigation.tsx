"use client";

import { routeConfig } from "@/config/route";
import NavigationDesktop from "./navigation-desktop";
import NavigationMobile from "./navigation-mobile";

const activeTransition = {
  type: "spring" as const,
  stiffness: 460,
  damping: 38,
  mass: 0.8,
};

export default function Navigation() {
  return (
    <>
      <NavigationDesktop
        links={routeConfig}
        activeTransition={activeTransition}
      />
      <NavigationMobile
        links={routeConfig}
        activeTransition={activeTransition}
      />
    </>
  );
}
