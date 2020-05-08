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
	style: style	
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

// control de busqueda
var searchControl = new L.Control.Search({
    layer: munis,
    propertyName: 'NAMEUNIT',	
	marker: false,
	zoom: 12
});
searchControl.on('search:locationfound', function(e) {   // Higlight the search result
    e.layer.setStyle({
		color: '#ff0000', 
		weight: 6
		});
	e.layer.bringToFront();
})
.on('search:collapsed', function(e) {
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