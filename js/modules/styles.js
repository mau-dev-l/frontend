import { COLORES } from '../config.js';

// --- ICONOS (Puntos) ---

// 1. FAISMUN 2024 (Azul)
export const iconoFAISMUN = L.divIcon({
    html: '<i class="fa-solid fa-building-flag"></i>',
    className: 'icono-faismun-div', // Clase en CSS (Azul)
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

// 2. FAISMUN 2023 (Verde) - NUEVO
export const iconoFAISMUN23 = L.divIcon({
    html: '<i class="fa-solid fa-building-flag"></i>',
    className: 'icono-faismun2023-div', // Asegúrate de tener esta clase en style.css (Verde)
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

// --- ESTILOS (Polígonos/Líneas) ---

export const estiloManzanas = {
    color: "#6c757d", 
    weight: 1.0, 
    fillColor: COLORES.manzanas, 
    fillOpacity: 0.4
};

export const estiloPredios = {
    color: COLORES.predios,
    weight: 0.5,
    fillColor: COLORES.predios,
    fillOpacity: 0.3
};

// Estilos NUEVOS
export const estiloColonias = { 
    color: "#a86f0e", 
    weight: 2, 
    fillColor: COLORES.colonias, 
    fillOpacity: 0.2 
};

export const estiloZAP = { 
    color: "#005a8a", 
    weight: 1.5, 
    fillColor: "#0077b6", 
    fillOpacity: 0.4 
};

export const estiloLimite = { 
    color: "#333", 
    weight: 4, 
    fill: false, // Solo contorno
    dashArray: '5, 10' // Línea punteada
};

export const estiloLineas24 = { 
    color: "#d62828", // Rojo
    weight: 4,
    opacity: 0.8
};

// --- POPUPS ---

export function popupFAISMUN(feature, layer) {
    if (feature.properties) {
        const nombre = feature.properties.obra_accio || feature.properties.nombre_obra; 
        const numero = feature.properties.no_aprobac || feature.properties.num_aprobacion;
        const col = feature.properties.colonia;

        layer.bindPopup(`
            <div style="font-family: system-ui; font-size: 14px;">
                <strong style="color: #0077b6;">Obra Pública</strong><br>
                ${nombre || "Sin Nombre"}<br>
                <hr style="margin: 5px 0;">
                <small><strong>No:</strong> ${numero || "S/N"}</small><br>
                <small><strong>Colonia:</strong> ${col || "N/D"}</small><br>
                <small class="text-muted" style="font-size: 11px;">ID: ${feature.properties.id}</small>
            </div>
        `);
    }
}

export function popupManzanas(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(`<strong>CVEGEO:</strong> ${feature.properties.cvegeo || feature.properties.cve_mza || "N/D"}`);
    }
}

// Popup Genérico para Colonias, ZAP, etc.
export function popupGenerico(feature, layer) {
    let contenido = "";
    const p = feature.properties;
    
    // Detectar qué tipo de capa es por sus propiedades
    if (p.nombre) contenido += `<strong>Colonia:</strong><br>${p.nombre}`; 
    else if (p.nom_asen) contenido += `<strong>Asentamiento:</strong><br>${p.nom_asen}`; 
    else if (p.cve_ageb) contenido += `<strong>ZAP (AGEB):</strong> ${p.cve_ageb}`;
    else if (p.municipio) contenido += `<strong>Límite:</strong> ${p.municipio}`;
    
    layer.bindPopup(contenido || "Sin datos");
}