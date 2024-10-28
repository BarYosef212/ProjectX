async function fetchBranchesAndAddMarkers(map) {
  try {
    // Fetch branches data from the backend
    const response = await fetch("/getAllBranches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Check if branches are available
      if (!data.branches || data.branches.length === 0) {
        console.warn("No branches found");
        return;
      }

      // Loop through branches and create markers
      for (const branch of data.branches) {
        const { location, branchName, branchAddress, bussinessHours, branchPhone } = branch;

        // Ensure coordinates exist before creating marker
        if (location && location.coordinate_x && location.coordinate_y) {
          const position = {
            lat: location.coordinate_x,
            lng: location.coordinate_y,
          };

          const marker = new google.maps.Marker({
            position,
            map,
            title: branchName,
          });

          // Info window for each branch
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="info-window">
                  <h5>${branchName}</h5>
                  <p><b>Address:</b> ${branchAddress}</p>
                  <p><b>Business Hours:</b> ${bussinessHours}</p>
                  <p><b>Phone:</b> ${branchPhone}</p>
              </div>
            `,
            disableAutoPan: true,
          });

          // Show info window on mouseover
          marker.addListener("mouseover", function() {
            infoWindow.open(map, marker);
          });

          // Close info window on mouseout
          marker.addListener("mouseout", function() {
            infoWindow.close();
          });
        } else {
          console.warn(`Branch '${branchName}' does not have valid coordinates.`);
        }
      }
    } else {
      console.error("Failed to fetch branches:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching branches:", error);
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
