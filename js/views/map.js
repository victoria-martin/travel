function renderMapView() {
  const regions = distinctRegions();
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Carte</h2>
        <p class="view-sub">Filtre par type, région ou scénario</p>
      </div>
    </div>
    <div class="map-layout">
      <div class="map-filters">
        <div class="filter-block">
          <div class="filter-title">Type de liste</div>
          ${Object.entries(ACCOMMODATION_TYPES)
            .map(
              ([key, t]) => `
            <label class="filter-option"><input type="checkbox" ${mapFilters.types.has(key) ? 'checked' : ''} onchange="toggleMapType('${key}')"><span class="legend-dot" style="background:${t.color};"></span>${t.label}</label>`,
            )
            .join('')}
        </div>
        <div class="filter-block">
          <div class="filter-title">Région</div>
          ${
            regions.length === 0
              ? `<div style="font-size:12.5px; color:var(--ink-soft);">Ajoute une région à tes hébergements pour filtrer ici.</div>`
              : regions
                  .map(
                    (r) =>
                      `<label class="filter-option"><input type="checkbox" ${mapFilters.regions.has(r) || mapFilters.regions.size === 0 ? 'checked' : ''} onchange="toggleMapRegion('${escapeHtml(r)}')">${escapeHtml(r)}</label>`,
                  )
                  .join('')
          }
        </div>
        <div class="filter-block">
          <div class="filter-title">Favoris</div>
          <label class="filter-option"
            ><input
              type="checkbox"
              ${mapFilters.favOnly ? 'checked' : ''}
              onchange="toggleMapFavOnly()"
            />⭐ Favoris uniquement</label
          >
        </div>
        <div class="filter-block">
          <div class="filter-title">Scénario</div>
          <select
            onchange="setMapScenario(this.value)"
            style="width:100%; font-size:13px; padding:7px 9px; border:1px solid var(--line); border-radius:7px;"
          >
            <option value="">Tous les hébergements</option>
            ${state.scenarios.map((s) => `<option value="${s.id}" ${mapFilters.scenarioId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
          </select>
          <div style="font-size:12px; color:var(--ink-soft); margin-top:8px;">
            Choisir un scénario trace son trajet et n'affiche que les hébergements qu'il utilise.
          </div>
        </div>
      </div>
      <div id="map"></div>
    </div>
  `;
}

function toggleMapType(t) {
  if (mapFilters.types.has(t)) mapFilters.types.delete(t);
  else mapFilters.types.add(t);
  render();
  setTimeout(initMap, 30);
}
function toggleMapRegion(r) {
  if (mapFilters.regions.has(r)) mapFilters.regions.delete(r);
  else {
    // if nothing was excluded yet (size 0 = "all"), start explicit set with everything except r
    if (mapFilters.regions.size === 0) {
      distinctRegions().forEach((x) => mapFilters.regions.add(x));
    }
    mapFilters.regions.delete(r);
  }
  render();
  setTimeout(initMap, 30);
}
function toggleMapFavOnly() {
  mapFilters.favOnly = !mapFilters.favOnly;
  render();
  setTimeout(initMap, 30);
}
function setMapScenario(id) {
  mapFilters.scenarioId = id || null;
  render();
  setTimeout(initMap, 30);
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = L.map('map').setView([44.3, 9.5], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(leafletMap);

  const regionFilterActive = mapFilters.regions.size > 0;
  let scenarioAccIds = null;

  if (mapFilters.scenarioId) {
    const s = getScenario(mapFilters.scenarioId);
    if (s) {
      scenarioAccIds = new Set(s.steps.map((st) => st.accommodationId).filter(Boolean));
      const linePoints = s.steps.map(coordsFor).filter(Boolean);
      if (linePoints.length > 1) {
        L.polyline(linePoints, { color: '#3E6259', weight: 3, dashArray: '6 6' }).addTo(leafletMap);
      }
      s.steps.forEach((st, idx) => {
        const c = coordsFor(st);
        if (c) {
          L.circleMarker(c, {
            radius: 7,
            color: '#24312B',
            weight: 1,
            fillColor: '#C98A3E',
            fillOpacity: 0.95,
          })
            .bindPopup(
              `<strong>${escapeHtml(st.city)}</strong><br/>Étape ${idx + 1}${st.nights ? ` · ${st.nights} nuit(s)` : ''}`,
            )
            .addTo(leafletMap);
        }
      });
    }
  }

  const bounds = [];
  state.accommodations.forEach((a) => {
    if (!a.lat || !a.lng) return;
    if (!mapFilters.types.has(a.type)) return;
    if (regionFilterActive && a.region && mapFilters.regions.has(a.region) === false) return;
    if (scenarioAccIds && !scenarioAccIds.has(a.id)) return;
    if (mapFilters.favOnly && !a.favorite) return;

    const color = accType(a.type).color;
    const c = [parseFloat(a.lat), parseFloat(a.lng)];
    bounds.push(c);
    L.circleMarker(c, {
      radius: 8,
      color: '#24312B',
      weight: 1,
      fillColor: color,
      fillOpacity: 0.9,
    })
      .bindPopup(
        `<strong>${a.favorite ? '★ ' : ''}${escapeHtml(a.name)}</strong><br/>${accType(a.type).label} · ${escapeHtml(a.city)}${a.price ? `<br/>${escapeHtml(a.price)} €` : ''}`,
      )
      .addTo(leafletMap);
  });

  if (bounds.length > 0) {
    leafletMap.fitBounds(bounds, { padding: [40, 40] });
  }
}
