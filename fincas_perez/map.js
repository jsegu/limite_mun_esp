//popup
function popup(feature, layer) {
    if (feature.properties) {
        // Extrae los campos que deseas mostrar
        let referenciaCatastral = feature.properties.nationalCadastralReference || "Sin referencia";
        let nombrePropietario = feature.properties.propiedad || "Sin información del propietario";
        let nombreHeredero = feature.properties.heredero || "Sin información del heredero";
        let superficie = feature.properties.areaValue ? feature.properties.areaValue + " m²" : "Superficie desconocida";

        // Crea el contenido del popup concatenando los campos
        let popupContent = `
            <strong>Referencia Catastral:</strong> ${referenciaCatastral}<br>
            <strong>Propietario:</strong> ${nombrePropietario}<br>
            <strong>Heredero:</strong> ${nombreHeredero}<br>
            <strong>Superficie:</strong> ${superficie}<br>
        `;

        // Asigna el contenido al popup
        layer.bindPopup(popupContent);
    }
}

// estilo capa referencia
function style(feature) {
    // Obtén el valor del atributo heredero
    let heredero = feature.properties.heredero;

    // Define el estilo condicional
    if (heredero === "Toño") {
        return {
            color: "orange",  // Borde naranja
            weight: 4,       // Borde grueso
            fillOpacity: 0   // Sin relleno
        };
    } else if (heredero === "Gela") {
        return {
            color: "purple", // Borde morado
            weight: 4,       // Borde grueso
            fillOpacity: 0   // Sin relleno
        };
    } else {
        // Estilo predeterminado
        return {
            color: "blue", // Borde gris
            weight: 4,        // Borde delgado
            fillOpacity: 0    // Sin relleno
        };
    }
}


// Capas
var fincas = L.geoJson(fincas, {
	onEachFeature: popup,
	style: style,
	attribution: '| develop by @Jordi_Segú'
	});
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>',
});	
var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
	layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
	format: 'image/jpeg',
	transparent: true,
	version: '1.3.0',//wms version (ver get capabilities)
	attribution: "| Map data © <a href='http://www.ign.es'>IGN"
});
var map = L.map('map', {
		center: [42.3997, -8.7714],
		zoom: 18,
		minZoom: 10,
		maxZoom: 18,
		maxBounds: [
			[20, -50],
			[50, 50]
			],
		layers: [osm, fincas]
	});
// capas de referencia grupo
var base = {
	"Mapa": osm,
	"Imagen": pnoa
}
var data = {
	"Fincas": fincas
}

// control de busqueda
var searchControl = new L.Control.Search({
    layer: fincas,
    propertyName: 'nationalCadastralReference',	
	marker: false,
	//zoom: 12
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
		fincas.eachLayer(function(layer) { //restauramos el color del elemento
			fincas.resetStyle(layer);
		});	
});
// poner el control busquedas
map.addControl(searchControl);

//control de capas
L.control.layers(base, data).addTo(map);

// Añadir el control de escala
L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

// Crear un control para la leyenda
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    // Contenedor principal de la leyenda con clase personalizada
    var div = L.DomUtil.create('div', 'legend-container');

    // Botón que mostrará/ocultará la leyenda
    div.innerHTML = `
        <button id="toggle-legend" style="cursor: pointer;">Mostrar Leyenda</button>
        <div id="legend-content" style="display: none; padding: 10px; background: white; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
            <strong>Leyenda</strong><br>
            <i style="background: orange; border: 2px solid orange;"></i> Toño<br>
            <i style="background: purple; border: 2px solid purple;"></i> Gela<br>
            <i style="background: #707070; border: 2px solid #707070;"></i> Abuelos
        </div>
    `;
    return div;
};

// Añadir la leyenda al mapa
legend.addTo(map);

// Manejar la visibilidad de la leyenda con el botón
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'toggle-legend') {
        var legendContent = document.getElementById('legend-content');
        var toggleButton = document.getElementById('toggle-legend');
        if (legendContent.style.display === 'none') {
            legendContent.style.display = 'block';
            toggleButton.textContent = 'Ocultar Leyenda';
        } else {
            legendContent.style.display = 'none';
            toggleButton.textContent = 'Mostrar Leyenda';
        }
    }
});

var marker;

this.map.locate({
  setView: true,
  maxZoom: 120
}).on("locationfound", e => {
    if (!marker) {
        marker = new L.marker(e.latlng).addTo(this.map);
    } else {
        marker.setLatLng(e.latlng);
    }
}).on("locationerror", error => {
    if (marker) {
        map.removeLayer(marker);
        marker = undefined;
    }
});