// Capas base
var munis = L.geoJson(munis, {
	color: "#cc0000", 
	weight: 2,
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
		zoomControl: false,
		center: [40, -3],
		zoom: 6,
		minZoom: 3,
		maxZoom: 20,
		maxBounds: [
			[20, -50],
			[50, 50]
			],
		layers: [munis, osm]
	});

// escala
L.control.scale().addTo(map);

// capas de referencia grupo
var overlay = {
	"Mapa": osm,
	"Imagen": pnoa
}

L.control.layers(overlay).addTo(map);
