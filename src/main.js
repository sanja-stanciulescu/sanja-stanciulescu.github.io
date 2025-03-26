
let panorama;
let targetLocation;
const locations = [{ lat: 44.453417, lng: 26.104954 },
  { lat: 44.480951, lng: 26.101824 },
  { lat: 44.478558, lng: 26.104557 },
  { lat: 44.479849, lng: 26.089160 },
  { lat: 44.487329, lng: 26.083030 },
  { lat: 44.490661, lng: 26.078970 },
  { lat: 44.477987, lng: 26.071918 },
  { lat: 44.478693, lng: 26.072087 }
 ];

const imageLocations = [{lat: 44.478542, lng: 26.102650},
  {lat: 44.477510, lng: 26.064135},
  {lat: 44.605236, lng: 26.085428}
];

const maxDistance = 50;

export function loadScript(index) {
  var myKey = "AIzaSyBM7igAh9vy8pl_xx1SATNDHhcNlxQn6RM";
  var script = document.createElement('script');
  script.type = 'text/javascript';
  targetLocation = locations[index];
  window["google_callback"] = initialize;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${myKey}&callback=window.google_callback&v=weekly`;
  document.body.appendChild(script);
}

export function initialize() {
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      position: targetLocation,
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
      showRoadLabels: false,
    }
  );
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getLocation(nextPageIndex, isGift) {
  navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const distance = getDistance(userLat, userLng, targetLocation.lat, targetLocation.lng);

    if (distance <= maxDistance) {
      if (isGift == 1) {
        const congratsMessage = document.getElementById("congrats-message");
        congratsMessage.classList.add("show-message");

        // Wait 3 seconds before redirecting
        setTimeout(() => {
          window.location.href = `../game${nextPageIndex}/index.html`; // Move to the next page
        }, 3000);
      } else {
        window.location.href = `../game${nextPageIndex}/index.html`; // Move to the next page
      }
    } else {
      const errorMessage = document.getElementById("error-message");
      errorMessage.style.display = "block";

      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 5000);

      document.body.addEventListener("click", () => {
        errorMessage.style.display = "none";
      });
    }
  }, () => {
    alert("Unable to retrieve your location. Please enable GPS.");
  });
}

export function addImageLocation(index) {
  targetLocation = imageLocations[index];
}

export function setupRevealButton(currentGameIndex, isGift) {
  document.getElementById("reveal-clue").addEventListener("click", () => {
    if (navigator.geolocation) {
      // Check if location permission has been granted
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          // If permission is granted, get the location
          getLocation(currentGameIndex + 1, isGift);
        } else if (permissionStatus.state === 'prompt') {
          // If permission hasn't been granted yet, request location
          getLocation(currentGameIndex + 1, isGift);
        } else {
          // Handle the case where permission is denied
          alert("You have denied location access. Please enable location sharing to continue.");
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });
}
