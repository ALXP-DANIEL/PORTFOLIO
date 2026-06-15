"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NavigationActionSpec } from "./types";

type NavigationActionContextValue = {
  action: NavigationActionSpec | null;
  setAction: (action: NavigationActionSpec | null) => void;
};

const NavigationActionContext =
  createContext<NavigationActionContextValue | null>(null);

export function NavigationActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [action, setAction] = useState<NavigationActionSpec | null>(null);

  const value = useMemo(
    () => ({
      action,
      setAction,
    }),
    [action],
  );

  return (
    <NavigationActionContext.Provider value={value}>
      {children}
    </NavigationActionContext.Provider>
  );
}

export function useNavigationAction() {
  const context = useContext(NavigationActionContext);

  if (!context) {
    throw new Error(
      "useNavigationAction must be used within NavigationActionProvider",
    );
  }

  return context;
}

/** Registers an action spec on mount and clears it on unmount. */
export function NavigationActionSlot({
  spec,
}: {
  spec: NavigationActionSpec | null;
}) {
  const { setAction } = useNavigationAction();

  useEffect(() => {
    setAction(spec);

    return () => {
      setAction(null);
    };
  }, [spec, setAction]);

  return null;
}
