// The API Key provided is restricted to JSFiddle website
// Get your own API Key on https://myprojects.geoapify.com
var myAPIKey = mapToken;

// console.log(JSON.parse(coordinates));

const [lng, lat] = JSON.parse(coordinates);

const defaultCoords = [23.0225, 72.5714];
const coords =
  typeof lat === 'number' && typeof lng === 'number'
    ? [lat, lng]
    : defaultCoords;

const map = L.map('my-map').setView(coords, 10);
const isRetina = L.Browser.retina;
const baseUrl =
  'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}';
const retinaUrl =
  'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}';
L.tileLayer(isRetina ? retinaUrl : baseUrl, {
  attribution: '',
  apiKey: myAPIKey,
  maxZoom: 20,
  id: 'osm-bright',
}).addTo(map);

// Create icon URL using Geoapify Icon API
const iconUrl = `https://api.geoapify.com/v1/icon/?type=awesome&color=%23ff0000&icon=location-dot&apiKey=${mapToken}`;

const customIcon = L.icon({
  iconUrl: iconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

L.marker(coords)
  .addTo(map)
  .bindPopup(
    `<h4 class="text-primary fw-bold">${title}</h4><p>Exact location will be provided after booking!</p>`
  );
