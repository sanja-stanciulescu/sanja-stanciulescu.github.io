console.log("ceva");
let panorama;
let targetLocation;
const locations = [{ lat: 44.459993, lng: 26.112981 }];
const maxDistance = 50;

export function loadScript(index) {
  var myKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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

function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const distance = getDistance(userLat, userLng, targetLocation.lat, targetLocation.lng);

    if (distance <= maxDistance) {
      window.location.href = "../game2/index.html"; // Move to the next page
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

document.getElementById("reveal-clue").addEventListener("click", () => {
  if (navigator.geolocation) {
    // Check if location permission has been granted
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      if (permissionStatus.state === 'granted') {
        // If permission is granted, get the location
        getLocation();
      } else if (permissionStatus.state === 'prompt') {
        // If permission hasn't been granted yet, request location
        getLocation();
      } else {
        // Handle the case where permission is denied
        alert("You have denied location access. Please enable location sharing to continue.");
      }
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
