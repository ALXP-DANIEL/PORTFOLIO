"use client";

import { routeConfig } from "@/config/route";
import NavigationDesktop from "./navigation-desktop";
import NavigationMobile from "./navigation-mobile";

const activeTransition = {
  duration: 0.3,
  ease: "power3.out",
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
