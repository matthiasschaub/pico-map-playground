// Work In Progress
// Leaflet Map
//

function json(response) {
    return response.json();
}

function status(response) {
    if (response.status === 404) {
        console.log(
            "Could not find regions.geojson on the server. Status Code: " +
                response.status
        );
        console.log("Fetch regions from OQT API. This takes quite a while.");
        return Promise.resolve(fetchRegionsFromApi());
    } else {
        return Promise.resolve(response);
    }
}

function fetchRegionsFromServer() {
    return fetch("data/regions.geojson");
}

function fetchRegionsFromApi() {
    // TODO: Add cache functionality
    return fetch(url + "/regions?asGeoJSON=True");
}

function onEachFeature(feature, layer) {
    var bounds = layer.getBounds();
    var center = bounds.getCenter();
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
        return L.marker(center, { alt: feature.properties.name })
            .bindPopup(feature.properties.name);
    }
    else {
        return L.marker(center)
    }
}

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
});

var map = L.map("leafletmap", {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [osm],
});

var feature = {
    type: "Feature",
    properties: {
        name: "Alger",
    },
    geometry: {
        type: "MultiPolygon",
        coordinates: [
            [
                [
                    [5.710744857788086, 34.83219341191838],
                    [5.724477767944336, 34.83219341191838],
                    [5.724477767944336, 34.8457895767176],
                    [5.710744857788086, 34.8457895767176],
                    [5.710744857788086, 34.83219341191838],
                ],
            ],
        ],
    },
};

var oqtRegions = L.geoJSON(feature, {
    onEachFeature: onEachFeature,
});

var overlayMaps = {
    "OQT Regions": oqtRegions,
    "MapAction Countries": oqtRegions,
};

// var baseMaps = {
//     OpenStreetMap: osm,
// };

// var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
var layerControl = L.control.layers(overlayMaps).addTo(map);
