import type { ReactNode } from 'react';
import { Icon } from '../../../shared/Icon';

// Le chrome commun aux trois cartes de l'accueil (icône, titre, lien) — le corps est écrit par
// l'appelant (ScenarioCard/PackingCard/TodoCard), passé en children.
export function HomeCard({
  icon,
  title,
  cta,
  onClick,
  children,
}: {
  icon: string;
  title: string;
  cta: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <section className="home-card" onClick={onClick}>
      <div className="home-card-head">
        <Icon name={icon} />
        <h3 className="home-card-title">{title}</h3>
      </div>
      {children}
      <span className="home-card-cta">
        {cta} <Icon name="arrow-up-right" />
      </span>
    </section>
  );
}
