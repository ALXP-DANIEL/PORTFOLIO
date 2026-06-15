"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useNavigationAction } from "./context";
import type {
  NavigationActionClassNames,
  NavigationActionIconComponent,
  NavigationActionSpec,
  NavigationButtonAction,
} from "./types";

function NavigationActionContent({
  action,
  icons,
  classNames,
}: {
  action: NavigationActionSpec;
  icons?: Record<string, NavigationActionIconComponent>;
  classNames?: NavigationActionClassNames;
}) {
  const label = action.label ?? "Action";
  const icon = action.icon;

  const Icon = icon?.name ? icons?.[icon.name] : undefined;
  const iconPosition = icon?.position ?? "right";

  const iconNode =
    icon && Icon ? (
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          classNames?.iconWrapper,
          action.classNames?.iconWrapper,
          icon.wrapperClassName,
        )}
        style={icon.wrapperStyle}
      >
        <Icon
          size={icon.size ?? 14}
          weight={icon.weight ?? "regular"}
          className={cn(
            "shrink-0",
            classNames?.icon,
            action.classNames?.icon,
            icon.className,
          )}
          style={icon.style}
        />
      </span>
    ) : null;

  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-2",
        classNames?.content,
        action.classNames?.content,
      )}
    >
      {iconPosition === "left" ? iconNode : null}

      <span
        className={cn("relative", classNames?.label, action.classNames?.label)}
      >
        {label}
      </span>

      {iconPosition === "right" ? iconNode : null}
    </span>
  );
}

/** Renders the currently-registered navigation action as a/link/button. */
export function NavigationActionOutlet({
  className,
  style,
  classNames,
  icons,
  onButtonAction,
}: {
  className?: string;
  style?: CSSProperties;
  classNames?: NavigationActionClassNames;
  icons?: Record<string, NavigationActionIconComponent>;
  onButtonAction?: (actionId: string, spec: NavigationButtonAction) => void;
}) {
  const { action } = useNavigationAction();

  if (!action) return null;

  const rootClassName = cn(
    className,
    classNames?.root,
    action.className,
    action.classNames?.root,
  );

  const rootStyle = {
    ...style,
    ...action.style,
  };

  if (action.kind === "a") {
    return (
      <a
        href={action.href}
        target={action.target ?? "_blank"}
        rel={action.rel ?? "noreferrer"}
        data-reticle
        aria-label={action.ariaLabel}
        aria-disabled={action.disabled}
        className={rootClassName}
        style={rootStyle}
        onClick={(event) => {
          if (action.disabled) {
            event.preventDefault();
          }
        }}
      >
        <NavigationActionContent
          action={action}
          icons={icons}
          classNames={classNames}
        />
      </a>
    );
  }

  if (action.kind === "link") {
    return (
      <Link
        href={action.href}
        data-reticle
        aria-label={action.ariaLabel}
        aria-disabled={action.disabled}
        className={rootClassName}
        style={rootStyle}
        onClick={(event) => {
          if (action.disabled) {
            event.preventDefault();
          }
        }}
      >
        <NavigationActionContent
          action={action}
          icons={icons}
          classNames={classNames}
        />
      </Link>
    );
  }

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (action.disabled) {
      event.preventDefault();
      return;
    }

    onButtonAction?.(action.actionId, action);

    window.dispatchEvent(
      new CustomEvent("navigation-action", {
        detail: {
          actionId: action.actionId,
          spec: action,
        },
      }),
    );
  };

  return (
    <button
      type={action.type ?? "button"}
      data-reticle
      data-action-id={action.actionId}
      aria-label={action.ariaLabel}
      disabled={action.disabled}
      className={rootClassName}
      style={rootStyle}
      onClick={handleButtonClick}
    >
      <NavigationActionContent
        action={action}
        icons={icons}
        classNames={classNames}
      />
    </button>
  );
}
