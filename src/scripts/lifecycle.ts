type Cleanup = () => void;

/**
 * Run an initializer for the current page and again after every ClientRouter
 * navigation, tearing the previous instance down before the swap.
 */
export function onPageLoad(init: () => Cleanup | void): void {
  let cleanup: Cleanup | undefined;

  document.addEventListener('astro:page-load', () => {
    cleanup?.();
    cleanup = init() ?? undefined;
  });

  document.addEventListener('astro:before-swap', () => {
    cleanup?.();
    cleanup = undefined;
  });
}
