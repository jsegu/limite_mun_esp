// Capas base
var munis = L.geoJson(munis, {
	color: "#707070", 
	weight: 1,
	fillOpacity: 0			
	});
	
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
	maxZoom: 18
});	

var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
	layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
	format: 'image/jpeg',
	transparent: true,
	version: '1.3.0',//wms version (ver get capabilities)
	attribution: "PNOA WMS. Cedido por © <a href='http://www.ign.es'>Instituto Geográfico Nacional de España"
});

var map = L.map('map', {
		center: [40, -3],
		zoom: 6,
		minZoom: 3,
		maxZoom: 20,
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

// buscador de geoJson
var searchControl = new L.Control.Search({
    layer: munis,
    propertyName: 'NAMEUNIT',	
	zoom: 12
});
// estilo nuevo buscado
searchControl.on('search_locationfound', function(e) {
	e.layer.setStyle({
		fillColor: '#3f0', 
		color: '#0f0'
	});
})
map.addControl(searchControl);

// // buscador de geoJson
// var searchLayer = L.layerGroup().addTo(map);
// //... adding data in searchLayer ...
// map.addControl(new L.Control.Search({layer: munis}) );
// //searchLayer is a L.LayerGroup contains searched markers

//control de capas
L.control.layers(base, data).addTo(map);

// Scale
L.control.scale({imperial: false}).addTo(map);
// Adding zoom control to the map
// L.control.zoom().addTo(map)


