/*
  Le chrome commun aux trois cartes de l'accueil : icône, titre, corps libre passé par l'appelant,
  et un lien qui ouvre toute la carte. Ce que chaque carte affiche dans son corps reste écrit par
  son propre fichier.
*/
function homeCard({ icon, title, body, cta, onclick }) {
  return /* HTML */ `<section class="home-card" onclick="${onclick}">
    <div class="home-card-head">${icon}<h3 class="home-card-title">${title}</h3></div>
    ${body}
    <span class="home-card-cta">${escapeHtml(cta)} ${svgIcon('arrow-up-right')}</span>
  </section>`;
}
