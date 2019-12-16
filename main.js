// initialize the map
var lat= 41.55;
var lng= -72.65;
var zoom= 10;

//Load a tile layer base map from USGS ESRI tile server https://viewer.nationalmap.gov/help/HowTo.htm
var hydro = L.esri.tiledMapLayer({url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer"}),
    topo = L.esri.tiledMapLayer({url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer"});

var baseMaps = {
    "Hydro": hydro,
    "Topo": topo
};

var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    layers:[hydro]
});

map.setView([lat, lng], zoom);
map.createPane('top');
map.getPane('top').style.zIndex=650;

L.control.attribution({position: 'bottomleft'}).addTo(map);

L.control.zoom({
    position:'topright'
}).addTo(map);

var layerControl = L.control.layers(baseMaps,null).addTo(map);

var breaks = [[75, 'High'],[60, 'Mod'],[43,'ModLow'],[20,'Low']]

function getColor(d) {
    if(d >= breaks[0][0]) {
        return '#0868ac';
    } else if(d >= breaks[1][0]) {
        return '#43a2ca';
    } else if(d >= breaks[2][0]) {
        return '#7bccc4';
    } else {
        return '#bae4bc'
    }
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.MODMMI),
        weight: 2,
        opacity: 0,
        color: 'white',
        fillOpacity: 0.6
    };
}

function onEachFeature(feature, layer) {
            var props = layer.feature.properties;
            if (props['GNIS_NAME']!= null){
                streamName= props['GNIS_NAME']
            }else{
                streamName= 'No Name Stream'
            }
            var popup = streamName+props['MODMMI'];
            layer.bindTooltip(popup)
        }

function filter (feature) {
    if (feature.properties['MODMMI'] != null){
        return feature;
    }
}

function drawLegend(breaks) {
    var legend = L.control({position: 'topleft'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = "<h3>" +'Predicted Water Quality in CT'+ "</h3>";
        for (var i = 0; i < breaks.length; i++) {
            var color = getColor(breaks[i][0], breaks);
            div.innerHTML +=
                '<span style="background:' + color + '"></span> ' +
                '<label>'+(breaks[i][0]).toLocaleString() + '</label>';
        }

        return div;
    };
    legend.addTo(map);
}

drawLegend(breaks);

var ctBoundJSON = $.getJSON("data/CT_state_boundary.geojson",function(data){
    var CTBound = L.geoJSON(data,{
        style: function (feature) {
            return {
                color: '#222',
                weight: 0.75,
                fillOpacity: 0,
                interactive: false
            };
        }
    });
    CTBound.addTo(map)
    map.fitBounds(CTBound.getBounds());
});

var HighJSON = $.when(ctBoundJSON).done(function(){$.getJSON("data/MMIMod_HighQuality.geojson", function (data){
    var High = L.geoJSON(data, {
        style: style,
        filter: filter,
        onEachFeature: onEachFeature
    }).addTo(map);
    layerControl.addOverlay(High,"High")
});
});

var modHighJSON = $.when(HighJSON).done(function () {$.getJSON("data/MMIMod_ModHighQuality.geojson", function (data){
    var modHigh = L.geoJSON(data, {
        style: style,
        filter: filter,
        onEachFeature: onEachFeature
    }).addTo(map);
    layerControl.addOverlay(modHigh,"modHigh")
});

});

var modLowJSON = $.when(modHighJSON).done(function () {$.getJSON("data/MMIMod_ModLowQuality.geojson", function (data){
    var modLow = L.geoJSON(data, {
        style: style,
        filter: filter,
        onEachFeature: onEachFeature
    }).addTo(map);
    layerControl.addOverlay(modLow,"modLow")
});

});

var LowJSON = $.when(modLowJSON).done(function () {$.getJSON("data/MMIMod_LowQuality.geojson", function (data){
    var Low = L.geoJSON(data, {
        style: style,
        filter: filter,
        onEachFeature: onEachFeature
    }).addTo(map);
    layerControl.addOverlay(Low,"Low")
});

});


/* --------------- Toggle on/off info footer content ---------------  */
var clicked = false;

function myInfo() {

    var x = document.getElementById('footer');
    if (x.style.height === '33vh') {
        x.style.height = '0px';
    } else {
        x.style.height = '33vh';
    }

    var y = document.getElementById('info-button');
    if (clicked) {
        y.style.background = 'rgba(100, 100, 100, 0.9)';
        clicked = false
    } else {
        y.style.background = 'rgba(146, 239, 146, 0.8)'
        clicked = true
    }
}

// function addDataToMap(data,Map){
//     L.geoJSON(data, {
//         style: style,
//         filter: function(feature){
//             if (feature.properties['MODMMI'] != null){
//                 return feature;
//             }
//         },
//         onEachFeature: onEachFeature
//     }).addTo(map);
// }
//
// var modHighJSON = $.getJSON("data/MMIMod_ModHighQuality.geojson", function (data){
//     var modHigh = addDataToMap(data,map);
// });
//
// var modLowJSON = $.when(modHighJSON).done(function ()
//     {$.getJSON("data/MMIMod_ModLowQuality.geojson", function (data){
//         addDataToMap(data,map);
//     })
// });
//
// var LowJSON = $.when(modLowJSON).done(function ()
// {$.getJSON("data/MMIMod_LowQuality.geojson", function (data){
//     addDataToMap(data,map);
// })
// });
//
// var HighJSON = $.when(LowJSON).done(function ()
// {$.getJSON("data/MMIMod_HighQuality.geojson", function (data){
//     addDataToMap(data,map);
// })
// });