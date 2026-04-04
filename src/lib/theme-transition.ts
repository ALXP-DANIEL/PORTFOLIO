export function applyThemeWithTransition(
  nextTheme: string,
  setTheme: (theme: string) => void,
) {
  const applyTheme = () => setTheme(nextTheme);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme();
    return;
  }

  const viewTransitionDocument = document as Document & {
    startViewTransition?: (update: () => void) => void;
  };

  if (viewTransitionDocument.startViewTransition) {
    viewTransitionDocument.startViewTransition(() => {
      applyTheme();
    });
    return;
  }

  document.documentElement.classList.add("theme-fade");
  applyTheme();
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-fade");
  }, 340);
}
