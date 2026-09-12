/*
  Every dropdown of the app is a <details> whose open state is mirrored in a global, so closing
  one means closing the element AND updating that global. Capture phase: the handler runs before
  the clicked button re-renders the DOM, while the <details> can still be compared to the target.
*/
document.addEventListener(
  'click',
  (event) => {
    document.querySelectorAll('details[open]').forEach((details) => {
      if (details.contains(event.target)) return;
      details.open = false;
      if (details.ontoggle) details.ontoggle.call(details, new Event('toggle'));
    });
  },
  true,
);
