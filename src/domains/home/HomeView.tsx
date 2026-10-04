import type { Travel } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { PackingCard } from './HomeView/PackingCard';
import { ScenarioCard } from './HomeView/ScenarioCard';
import { TodoCard } from './HomeView/TodoCard';

function formatHomeDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Port de homeDatesLabel (js/views/home/home.js).
function homeDatesLabel(travel: Travel | null): string {
  const start = travel && window.isoToDate(travel.startDate);
  if (!start) return '';
  const end = travel?.endDate && window.isoToDate(travel.endDate);
  const range = end ? `${formatHomeDate(start)} → ${formatHomeDate(end)}` : formatHomeDate(start);
  const today = new Date(new Date().toDateString());
  const days = Math.round((start.getTime() - today.getTime()) / 86400000);
  return days > 0 ? `${range} · J-${days}` : range;
}

// Porte js/views/home/{home,card,scenario-card,packing-card,todo-card}.js.
export function HomeView() {
  useTravelStore();
  const travel = window.currentTravel();
  const title = travel ? `${travel.emoji} ${travel.name}` : 'Accueil';

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">{title}</h2>
          <span className="view-sub">{homeDatesLabel(travel)}</span>
        </div>
      </div>
      <div className="home-cards">
        <ScenarioCard />
        <PackingCard />
        <TodoCard />
      </div>
    </>
  );
}
