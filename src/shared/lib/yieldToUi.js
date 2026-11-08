// Gives the browser a moment to redraw, so progress bars stay smooth.
export function yieldToUi() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
