import { VISTA_INICIAL } from '../config.js';

export function initMap() {
    // Inicializar mapa en el div 'map-container'
    const map = L.map('map-container', {
        center: [VISTA_INICIAL.lat, VISTA_INICIAL.lng],
        zoom: VISTA_INICIAL.zoom,
        zoomControl: false, // Lo ponemos manual abajo para cambiar posición
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'Centrar mapa aquí',
            callback: (e) => map.panTo(e.latlng)
        }]
    });

    // Capa Base (OpenStreetMap)
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    });

    // Capa Satélite (Esri)
    const satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
    });

    // Añadir OSM por defecto
    osm.addTo(map);

    // Controles
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Devolvemos el mapa y las capas base para el control de capas
    return { map, baseLayers: { "Mapa Calles": osm, "Satélite": satelite } };
}