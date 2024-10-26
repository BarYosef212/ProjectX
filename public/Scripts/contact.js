async function fetchBranchesAndAddMarkers(map) {
  try {
    // Fetch branches data from the backend
    const response = await fetch("/getAllBranches"); // Adjust URL to your backend route
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Handle network errors
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Check if branches are available
    if (!data.branches || data.branches.length === 0) {
      console.warn("No branches found");
      return; // Exit if no branches
    }

    // Iterate over each branch and create a marker
    data.branches.forEach((branch) => {
      const { location, branchName } = branch; // Destructure for clarity

      // Ensure coordinates are available before creating the marker
      if (location && location.coordinate_x && location.coordinate_y) {
        const position = {
          lat: location.coordinate_x, // Latitude
          lng: location.coordinate_y, // Longitude
        };

        // Create and add the marker to the map
        const marker = new google.maps.Marker({
          position,
          map,
          title: branchName, // Title for the marker
        });

        // Optionally add an info window for more details
        const infoWindow = new google.maps.InfoWindow({
          content: `<h4>${branchName}</h4>`, // You can add more details here
        });

        // Open the info window when the marker is clicked
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      } else {
        console.warn(`Branch '${branchName}' does not have valid coordinates.`);
      }
    });
  } catch (error) {
    console.error("Error fetching branches:", error); // Log errors
  }
}
// Function to initialize the Google Map
function initMap() {
  const position = { lat: 31.970853, lng: 34.771742 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: 10,
  });

  fetchBranchesAndAddMarkers(map);
}

window.initMap = initMap;

