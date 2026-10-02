import { LegacyMarkup } from '../shared/LegacyMarkup';

// Délégué entièrement : glisser-déposer HTML5 pour réordonner, tiroir "Plus" — une logique
// entière à dupliquer pour un gain nul tant que ce n'est pas elle qui pose problème.
export function MobileNav() {
  return (
    <>
      <LegacyMarkup html={window.mobileNavBar()} />
      {window.mobileNavPlusOpen && <LegacyMarkup html={window.mobileNavPlusSheet()} />}
    </>
  );
}
