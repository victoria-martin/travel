/*
  Every floating panel of the app is a <details> whose open state is mirrored in a global, so
  closing one means closing the element AND updating that global. They are named one by one: a
  <details> that discloses content in place — the families of a recap — belongs to the page and
  stays open. Capture phase: the handler runs before the clicked button re-renders the DOM, while
  the <details> can still be compared to the target.
*/
const FLOATING_PANELS =
  'details.inline-dropdown[open], details.toolbar-panel[open], details.travel-selector[open]';

document.addEventListener(
  'click',
  (event) => {
    document.querySelectorAll(FLOATING_PANELS).forEach((details) => {
      if (details.contains(event.target)) return;
      details.open = false;
      if (details.ontoggle) details.ontoggle.call(details, new Event('toggle'));
    });
  },
  true,
);
