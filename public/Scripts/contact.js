function initMap() {
  // Define the location
  const position = { lat: 31.970853, lng: 34.771742 };

  // Initialize the map
  const map = new google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: 10,
  });

  // Add the marker using the basic Marker class
  const marker = new google.maps.Marker({
    position: position,
    map: map,
    title: "Uluru",
  });
}

// Assign initMap to the window to be used as a callback
window.initMap = initMap;

// async function fetchData() {
//   try {
//     const response = await fetch('/getAllBranches');
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
    
//     const data = await response.;
//     console.log(data); // Display the fetched data in the console
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// }

// Call the fetch function as needed
fetchData();
