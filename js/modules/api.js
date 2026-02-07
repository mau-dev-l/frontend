// frontend/js/modules/api.js

// URL base de tu GeoServer (Servicio OWS maneja tanto WFS como WMS)
const GEOSERVER_URL = "https://sigetux.tuxtla.gob.mx:8443/geoserver/visop/ows";

/**
 * Función genérica para consultar capas WFS (Vectoriales) desde GeoServer
 * Retorna un GeoJSON listo para Leaflet.
 * @param {string} layerName - Nombre de la capa en GeoServer (ej: 'faismun_2024_geo')
 */
export async function fetchWFS(layerName) {
    try {
        // Construimos la URL con los parámetros estándar de WFS
        const params = new URLSearchParams({
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typeName: `visop:${layerName}`, // Agregamos el workspace 'visop'
            outputFormat: 'application/json',
            srsName: 'EPSG:4326'
        });

        const url = `${GEOSERVER_URL}?${params.toString()}`;
        // console.log(`📡 Consultando GeoServer: ${url}`); 

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`GeoServer Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`❌ Error descargando capa WFS (${layerName}):`, error);
        return null;
    }
}

// Exportamos la URL base por si la necesitamos para WMS en otros lados
export const GEOSERVER_BASE_URL = "https://sigetux.tuxtla.gob.mx:8443/geoserver/visop/wms";