// Initialize the map and set the view to Turkey (latitude, longitude, zoom level)
const map = L.map('map').setView([39.92077, 32.85411], 6);  // Centered on Turkey

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Event types and corresponding icon URLs
const eventTypes = {
  'active-protest': 'icons/protest.png',
  'future-protest': 'icons/future-protest.png',
  'police': 'icons/police.png',
  'clash': 'icons/clash.png',
};

// Store markers for each event (so they don't get replaced)
let markers = [];

// Define the current selected event type
let selectedType = null;

// Helper function to create a marker with the selected icon for an event type
function createMarker(lat, lng, type, time = null, notes = '') {
  const iconUrl = eventTypes[type];

  // Create a custom icon using the icon URL for the event type
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: [30, 30],    // Adjust size as needed
    iconAnchor: [15, 30],  // Position the icon
    popupAnchor: [0, -30]  // Position the popup
  });

  // Create a marker using the custom icon
  const marker = L.marker([lat, lng], { icon: icon }).addTo(map);

  // Create a detailed popup for the marker
  let popupContent = `${type.replace('-', ' ').toUpperCase()} at ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  
  if (time) {
    popupContent += `<br><strong>Time:</strong> ${time}`;
  }
  if (notes) {
    popupContent += `<br><strong>Notes:</strong> ${notes}`;
  }

  // Add a popup with event type, time, and notes
  marker.bindPopup(popupContent);
  
  // Store the marker in the markers array
  markers.push(marker);
  return marker;
}

// Handle the long-click (mouse down) event
let clickTimer;
const longClickThreshold = 1000; // 1 second for long click

map.on('mousedown', function(event) {
  clickTimer = setTimeout(() => {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    // If a type is selected, create a marker
    if (selectedType) {
      // Prompt for time and notes for all event types
      const time = prompt('Please enter the event time (e.g., "2025-05-10 14:00"):');
      const notes = prompt('Please add any additional notes for the event:');
      createMarker(lat, lng, selectedType, time, notes);
    } else {
      alert('Please select an event type first.');
    }
  }, longClickThreshold);
});

// Cancel long-click if mouse is released before the threshold
map.on('mouseup', function() {
  clearTimeout(clickTimer);
});

// Set up buttons for event type selection
document.getElementById('active-protest').addEventListener('click', () => {
  selectedType = 'active-protest';
  alert('You have selected the Active Protest marker.');
});

document.getElementById('future-protest').addEventListener('click', () => {
  selectedType = 'future-protest';
  alert('You have selected the Future Protest marker.');
});

document.getElementById('police').addEventListener('click', () => {
  selectedType = 'police';
  alert('You have selected the Police Activity marker.');
});

document.getElementById('clash').addEventListener('click', () => {
  selectedType = 'clash';
  alert('You have selected the Clash marker.');
});

// Add geolocation control to the map
const geolocationButton = L.control({position: 'bottomright'});

geolocationButton.onAdd = function(map) {
  const button = L.DomUtil.create('button', 'geolocation-button');
  button.innerHTML = 'Show My Location';
  button.onclick = function() {
    map.locate({setView: true, maxZoom: 16});
  };
  return button;
};

geolocationButton.addTo(map);

// When the location is found, show a marker at the user's location
map.on('locationfound', function(e) {
  const radius = e.accuracy / 2;

  // Create a circle marker at the user's location
  L.marker(e.latlng).addTo(map)
    .bindPopup("You are here")
    .openPopup();

  L.circle(e.latlng, radius).addTo(map);
});

// If the location is not found, show an error message
map.on('locationerror', function() {
  alert('Unable to find your location. Please enable location services.');
});
