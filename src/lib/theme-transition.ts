export function applyThemeWithTransition(
  nextTheme: string,
  setTheme: (theme: string) => void,
) {
  const applyTheme = () => setTheme(nextTheme);
  const root = document.documentElement;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme();
    return;
  }

  const viewTransitionDocument = document as Document & {
    startViewTransition?: (update: () => void) => { finished?: Promise<void> };
  };

  if (viewTransitionDocument.startViewTransition) {
    root.classList.add("theme-switching");

    const transition = viewTransitionDocument.startViewTransition(() => {
      applyTheme();
    });

    if (transition?.finished) {
      transition.finished.finally(() => {
        root.classList.remove("theme-switching");
      });
    } else {
      window.setTimeout(() => {
        root.classList.remove("theme-switching");
      }, 1000);
    }

    return;
  }

  document.documentElement.classList.remove("theme-fade");
  document.documentElement.classList.add("theme-fade");
  applyTheme();
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-fade");
  }, 340);
}
