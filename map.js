//popup
function popup(feature, layer) {
		if (feature.properties && feature.properties.NAMEUNIT) {
			layer.bindPopup(feature.properties.NAMEUNIT);
		}
	}

// estilo capa referencia
function style(feature) {
	return { 
		color: "#707070", 
		weight: 1,
		fillOpacity: 0	
	};
}

// Capas
var munis = L.geoJson(munis, {
	onEachFeature: popup,
	style: style,
	attribution: '| Download kml by ©<a href="https://github.com/mapbox/tokml"> Mapbox tokml</a>'
	});
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>',
	maxZoom: 18
});	
var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
	layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
	format: 'image/jpeg',
	transparent: true,
	version: '1.3.0',//wms version (ver get capabilities)
	attribution: "| Map data © <a href='http://www.ign.es'>IGN"
});
var map = L.map('map', {
		center: [40, -3],
		zoom: 5,
		minZoom: 3,
		maxZoom: 18,
		maxBounds: [
			[20, -50],
			[50, 50]
			],
		layers: [osm, munis]
	});
// capas de referencia grupo
var base = {
	"Mapa": osm,
	"Imagen": pnoa
}
var data = {
	"Municipios": munis
}

// control de busqueda
var searchControl = new L.Control.Search({
    layer: munis,
    propertyName: 'NAMEUNIT',	
	marker: false,
	zoom: 12
});
var buscat;
searchControl.on('search:locationfound', function(e) {   // Higlight the search result
	buscat = e
	e.layer.setStyle({
		color: '#ff0000', 
		weight: 3.5
		});
	e.layer.bringToFront();
	// var buscat = e['text'];
})
.on('search:expanded', function(e) {
		munis.eachLayer(function(layer) { //restauramos el color del elemento
			munis.resetStyle(layer);
		});	
});
// poner el control busquedas
map.addControl(searchControl);


//control de capas
L.control.layers(base, data).addTo(map);

// Scale
L.control.scale({imperial: false}).addTo(map);

//export to kml
// function baixarr(){
	// // console.info(buscat.layer.feature.properties["NAMEUNIT"]); //nom municipi
	// // then export to kml
    // var kml = tokml(buscat.layer.feature);
	// kml.download = buscat.layer.feature.properties["NAMEUNIT"]+".kml";
// }
function baixarr(){
	// console.info(buscat.layer.feature.properties["NAMEUNIT"]); //nom municipi
	// then export to kml
	if (buscat === undefined) {
		alert("Primero selecciona un municipio");
	}
	else {
		var kml = tokml(buscat.layer.feature);
		var hiddenElement = document.createElement('a')
		hiddenElement.href = 'data:attachment/text,' + encodeURI(kml);
		hiddenElement.target = '_blank';
		hiddenElement.download = buscat.layer.feature.properties["NAMEUNIT"]+".kml";
		hiddenElement.click();
	}
}
