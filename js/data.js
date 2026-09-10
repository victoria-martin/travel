const CITY_PRESETS = {
  "Marseille": [43.2965, 5.3698],
  "Sarzana": [44.1069, 9.9599],
  "Sienne": [43.3188, 11.3308],
  "Sovicille": [43.2833, 11.2000],
  "Grosseto": [42.7628, 11.1122],
  "Florence": [43.7696, 11.2558],
  "Finale Ligure": [44.1706, 8.3416],
  "Pise": [43.7228, 10.4017],
  "Lucques": [43.8430, 10.5027],
};

const STORAGE_KEY = "trip-data";

function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4); }

const IMPORT_BATCH_1 = {
  accommodations: [
    {type:'homeExchange', name:'Montefalco (HomeExchange)', city:'Montefalco', region:'Ombrie', lat:'42.899', lng:'12.649', price:'133', dates:'25 au 30', link:'https://www.homeexchange.fr/homes/view/2912045', notes:'Peut-être pas très propre'},
    {type:'homeExchange', name:'Montefollonico (HomeExchange)', city:'Montefollonico', region:'Sienne', lat:'43.1206', lng:'11.6435', price:'243', dates:'Toute la période', link:'https://www.homeexchange.fr/homes/view/1492676', notes:'Salon pas très confortable, en Toscane, très beau'},
    {type:'homeExchange', name:'Chez Jacopo — Sovicille', city:'Sovicille', region:'Sienne', lat:'43.2833', lng:'11.2000', price:'315/nuit', dates:'Toute la période', link:'https://www.homeexchange.fr/homes/view/2880338', notes:'Très grande et belle maison, très bien située. Options : 5 nuits = 1575€, 4 nuits = 1260€, 3 nuits = 945€.'},
    {type:'hotel', name:'Hotel La Collegiata', city:'Sienne', region:'Sienne', lat:'43.3188', lng:'11.3308', price:'', dates:'', link:'https://hotellacollegiata.reserve-online.net/accommodation/room', notes:'Beau mais à 50 min de Sienne'},
    {type:'hotel', name:"Residenza d'epoca San Martino 29", city:'Sienne', region:'Sienne', lat:'43.3188', lng:'11.3308', price:'', dates:'', link:'', notes:'Très beau mais pas disponible. Note établissement : 4/5'},
    {type:'hotel', name:'Villa La Torre alle Tolfe', city:'Sienne', region:'Sienne', lat:'43.3188', lng:'11.3308', price:'250/nuit (500 pour 2 nuits)', dates:'21→23 ou 23→25 sept', link:'https://www.booking.com/hotel/it/villa-la-torre-alle-tolfe.fr.html', notes:'Parfait, il faut booker. Adresse : Borgo La Torre alle Tolfe'},
    {type:'hotel', name:'Villa Il Castagno Wine & Resort', city:'Sienne', region:'Sienne', lat:'43.3188', lng:'11.3308', price:'500/nuit (1000 pour 2 nuits)', dates:'23→25 sept', link:'https://www.booking.com/hotel/it/villa-il-castagno-wine-amp-resort.html', notes:'Wine resort, très cher, peut-être un peu prétentieux'},
    {type:'hotel', name:'Agriturismo Casalino18', city:'Sienne', region:'Sienne', lat:'43.3131', lng:'11.2775', price:'123/nuit (492 pour 4 nuits, 369 pour 3 nuits)', dates:'', link:'https://www.booking.com/hotel/it/agriturismo-casalino18.fr.html', notes:'Excellente situation géographique, note 9.3/10 (490 avis). Adresse : 18 Strada del Pian del Lago, 53100 Sienne'},
    {type:'hotel', name:'Il Ciocco Hotels', city:'Barga', region:'Lucques / Garfagnana', lat:'44.0742', lng:'10.4753', price:'160/nuit', dates:'21/09', link:'https://www.booking.com/hotel/it/il-ciocco-the-living-mountain-barga.fr.html', notes:'Chalets mignons, annulable gratuitement avant la date. Pas super bien noté'},
    {type:'hotel', name:'Villa Moorings', city:'Barga', region:'Lucques / Garfagnana', lat:'44.0742', lng:'10.4753', price:'200/nuit', dates:'21/09', link:'https://www.villamoorings.it/en/homepage/', notes:'Plutôt joli'},
    {type:'hotel', name:'Antico Casale', city:'Sarzana', region:'Ligurie', lat:'44.1069', lng:'9.9599', price:'152 (1 nuit, pack remboursable)', dates:'21/09', link:'https://www.booking.com/hotel/it/antico-casale-sarzana.fr.html', notes:'Super ! Adresse : Via Navonella 7, 19038 Sarzana'},
    {type:'hotel', name:'Villa Preselle Country Resort', city:'Preselle', region:'Maremme / Grosseto', lat:'42.667', lng:'11.233', price:'150/nuit (450 pour 3 nuits)', dates:'22→25 oct (à vérifier)', link:'https://www.booking.com/hotel/it/residence-villa-preselle-preselle1.fr.html', notes:''},
  ],
  cars: [
    {name:'Kayak — T-Cross (Sienne)', price:'295 (5 jours)', dates:'25/09 → 30/09', location:'Sienne', notes:'Lien : https://www.kayak.fr/cars/Sienne,Toscane,Italie-c23525'},
  ]
};

function applyImportBatch1(){
  if(state.importsDone && state.importsDone.batch1) return;
  IMPORT_BATCH_1.accommodations.forEach(a=>{ state.accommodations.push({id:uid(), notes:'', link:'', price:'', dates:'', region:'', lat:'', lng:'', ...a}); });
  IMPORT_BATCH_1.cars.forEach(c=>{ state.cars.push({id:uid(), notes:'', ...c}); });
  if(!state.importsDone) state.importsDone = {};
  state.importsDone.batch1 = true;
  scheduleSave();
  render();
}

function defaultData(){
  return {
    accommodations: [],
    cars: [],
    fixedCosts: [],
    importsDone: {},
    scenarios: [
      {
        id: uid(),
        name: "Découverte Toscane (base)",
        steps: [
          { id: uid(), city: "Marseille", region: "Provence", arrivalDate: "", nights: 0, accommodationId: null, notes: "Départ" },
          { id: uid(), city: "Sarzana", region: "Ligurie", arrivalDate: "", nights: 1, accommodationId: null, notes: "1ère étape" },
          { id: uid(), city: "Grosseto", region: "Maremme", arrivalDate: "", nights: 2, accommodationId: null, notes: "" },
          { id: uid(), city: "Sovicille", region: "Sienne", arrivalDate: "", nights: 2, accommodationId: null, notes: "Zone Sienne" },
          { id: uid(), city: "Florence", region: "Florence", arrivalDate: "", nights: 2, accommodationId: null, notes: "" },
          { id: uid(), city: "Marseille", region: "Provence", arrivalDate: "", nights: 0, accommodationId: null, notes: "Retour" },
        ]
      }
    ]
  };
}

let state = null;
let view = "hebergements"; // hebergements | voitures | charges | scenarios | scenario-detail | carte
let listViewMode = { hebergements: "table", voitures: "table", charges: "table" };
let listFilters = { favOnly: false };
let activeScenarioId = null;
let modal = null; // {type, payload}
let mapFilters = { hotel:true, homeExchange:true, regions:new Set(), scenarioId:null, favOnly:false };
let leafletMap = null;
let saveTimer = null;
const LOCAL_KEY = "voyage-toscane-local-data";
