// Define streetmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  });

  streetmap.addTo(myMap)

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",function(data)
    {
    function style_info(feature) {
        return {
          radius: getradius(feature.properties.mag),
          fillColor: getcolor(feature.properties.mag),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };
      }

      // define markers for the map
      function getradius(magnitude) {
        return magnitude * 4;
      }
    // define the marker colors as they relate to the earthquake magnitudes
      function getcolor(magnitude) {
        if (magnitude > 5) {
            return 'red'
        } else if (magnitude > 4) {
            return 'darkorange'
        } else if (magnitude > 3) {
            return 'tan'
        } else if (magnitude > 2) {
            return 'yellow'
        } else if (magnitude > 1) {
            return 'darkgreen'
        } else {
            return 'lightgreen'
        };
    }
         // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the place and time of the earthquake
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
            "<h4>" + "Mag : " +  feature.properties.mag + "</h4>");
        }
        // Create a GeoJSON layer containing the features array on the earthquakeData object
        // Run the onEachFeature function once for each piece of data in the array
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                      return L.circleMarker(latlng);
                  },
             style: style_info,     
            onEachFeature: onEachFeature
          }).addTo(myMap)

        //   Create a legend
          var legend = L.control({position: 'bottomright'});

        //   Add to map
          legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]
        
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getcolor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap); 
});