type Cleanup = () => void;

/**
 * Run an initializer for the current page and again after every ClientRouter
 * navigation, tearing the previous instance down before the swap.
 */
export function onPageLoad(init: () => Cleanup | void): void {
  let cleanup: Cleanup | undefined;
  let initialized = false;

  const run = () => {
    if (initialized) return;
    initialized = true;
    cleanup = init() ?? undefined;
  };

  const teardown = () => {
    if (!initialized) return;
    initialized = false;
    cleanup?.();
    cleanup = undefined;
  };

  document.addEventListener('astro:page-load', run);
  document.addEventListener('astro:before-swap', teardown);

  // Module scripts are deferred, so on a normal load the DOM is ready here.
  // New scripts loaded during a navigation run after the swap, before
  // astro:page-load fires.
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run, { once: true });
}
