import * as Tabs from '@radix-ui/react-tabs';
import { Icon } from '../../shared/Icon';
import { SettingsMenu } from '../../shared/toolbar/SettingsMenu';
import { useTravelStore } from '../../store/useTravelStore';
import { CarsTab } from './TransportsView/CarsTab';
import { ProvidersTab } from './TransportsView/ProvidersTab';
import { TransportsListTab } from './TransportsView/TransportsListTab';

export function TransportsView() {
  const transportCount = useTravelStore(
    (store) => window.ofCurrentTravel(store.data.transports).length,
  );
  const providerCount = useTravelStore(
    (store) => window.ofCurrentTravel(store.data.providers).length,
  );
  const offerCount = useTravelStore((store) => window.ofCurrentTravel(store.data.offers).length);

  return (
    <Tabs.Root defaultValue="trajets" className="transports-react-view">
      <div className="view-header">
        <h2 className="view-title">Transports</h2>
        <div className="view-header-actions">
          <SettingsMenu />
        </div>
        {/* create subcomponent */}
        <Tabs.List className="view-tabs" aria-label="Sections Transports">
          <Tabs.Trigger className="view-tab" value="trajets">
            <span className="view-tab-icon">
              <Icon name="plane" />
            </span>
            <span>Trajets</span>
            <span className="view-tab-count">{transportCount}</span>
          </Tabs.Trigger>
          <Tabs.Trigger className="view-tab" value="prestataires">
            <span className="view-tab-icon">
              <Icon name="building-2" />
            </span>
            <span>Loueurs &amp; compagnies</span>
            <span className="view-tab-count">{providerCount}</span>
          </Tabs.Trigger>
          <Tabs.Trigger className="view-tab" value="voitures">
            <span className="view-tab-icon">
              <Icon name="car" />
            </span>
            <span>Voitures</span>
            <span className="view-tab-count">{offerCount}</span>
          </Tabs.Trigger>
        </Tabs.List>
      </div>
      <Tabs.Content value="trajets">
        <TransportsListTab />
      </Tabs.Content>
      <Tabs.Content value="prestataires">
        <ProvidersTab />
      </Tabs.Content>
      <Tabs.Content value="voitures">
        <CarsTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}
