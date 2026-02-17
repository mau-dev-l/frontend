// frontend/js/modules/pim2025.js

const GEOSERVER_BASE_URL = 'https://sigetux.tuxtla.gob.mx:8443/geoserver';
const WORKSPACE = 'visop'; 
const LAYER_NAME = 'pim_2025'; 

export async function cargarPim2025() {
    console.log("📡 Conectando PIM 2025 (WMS + WFS)...");

    try {
        const wmsLayer = L.tileLayer.wms(`${GEOSERVER_BASE_URL}/${WORKSPACE}/wms`, {
            layers: `${WORKSPACE}:${LAYER_NAME}`,
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            zIndex: 1000,
            tiled: true
        });

        const wfsUrl = `${GEOSERVER_BASE_URL}/${WORKSPACE}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${WORKSPACE}:${LAYER_NAME}&outputFormat=application/json`;
        const response = await fetch(wfsUrl);
        if (!response.ok) throw new Error("Fallo WFS");
        const geoJson = await response.json();

        const wfsLayer = L.geoJSON(geoJson, {
            pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 10, opacity: 0, fillOpacity: 0 }),
            onEachFeature: (feature, layer) => {
                feature.properties._legendKey = 'pim2025';
                layer.bindPopup(crearPopupPremium(feature.properties));
            }
        });

        const originalOnAdd = wfsLayer.onAdd.bind(wfsLayer);
        const originalOnRemove = wfsLayer.onRemove.bind(wfsLayer);
        wfsLayer.onAdd = function(map) { originalOnAdd(map); wmsLayer.addTo(map); return this; };
        wfsLayer.onRemove = function(map) { originalOnRemove(map); map.removeLayer(wmsLayer); return this; };

        return wfsLayer;
    } catch (error) {
        console.error("❌ Error PIM 2025:", error);
        return null;
    }
}

function crearPopupPremium(p) {
    const nombreObra = p['Nombre de'] || 'NOMBRE NO DISPONIBLE';
    const descripcion = p['Descrició'] || 'Sin descripción'; 
    const clavePres = p['Clave Pres'] || '';
    const noAprob = p['No de Apro'] || 'S/D';
    const noContrato = p['No de Cont'] || 'S/D';
    const tipoProy = p['Tipo de Pr'] || 'Infraestructura';
    const avanceFis = p['Avance Fis'] || '0';
    const avanceFin = p['Avance Fin'] || '0';
    const unidadRes = p['Unidad Res'] || 'S/D';
    const unidadOp = p['Unidad R_1'] || 'S/D';
    
    // --- NUEVO CAMPO AGREGADO ---
    const colonia = p['Colonia'] || 'Sin colonia asignada';
    
    let montoFormat = '$0.00';
    try { 
        const valor = p['Monto Apro']; 
        if (valor) {
            const numero = parseFloat(String(valor).replace(/[^0-9.-]+/g,""));
            montoFormat = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numero); 
        }
    } catch(e) {}

    const safeNombre = nombreObra.replace(/"/g, '&quot;');
    const safeCve = String(clavePres).trim();
    
    let descList = descripcion.replace(/(\d+\.-)/g, '<br><strong style="color:#000;">$1</strong>');
    if (descList.startsWith('<br>')) descList = descList.substring(4);

    return `
        <div style="font-family: 'Segoe UI', sans-serif; min-width: 320px; max-width: 340px;">
            <div style="background-color: #00897B; color: white; padding: 10px; font-weight: bold; border-radius: 5px 5px 0 0; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-helmet-safety"></i> PIM 2025
            </div>
            <div style="padding: 15px; background: white; border: 1px solid #ddd; border-top: none;">
                <div style="font-weight: 800; color: #004D40; font-size: 13px; margin-bottom: 12px;">${nombreObra}</div>
                <div style="font-size: 10px; color: #888; font-weight: bold; text-transform: uppercase;">DESCRIPCIÓN</div>
                <div style="background: #E0F2F1; border-left: 4px solid #00897B; padding: 8px; font-size: 12px; margin-bottom: 15px;">${descList}</div>

                <button onclick="window.abrirGaleria('${safeCve}', '${safeNombre}', 'pim_2025', 'png')" 
                    class="btn btn-outline-dark btn-sm w-100 mb-3" 
                    style="border-radius: 4px; font-weight: 600; padding: 6px; font-size: 13px; border-color: #004D40; color: #004D40;">
                    <i class="fa-solid fa-camera me-1"></i> Ver Evidencia
                </button>

                <div style="margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px dashed #ccc; font-size: 11px; color: #333;">
                    <strong style="color: #00796B;"><i class="fa-solid fa-map-location-dot"></i> Colonia:</strong> ${colonia}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px; margin-bottom: 15px; color: #333;">
                    <div><strong style="color: #00796B;">No. Aprob:</strong><br>${noAprob}</div>
                    <div><strong style="color: #00796B;">Contrato:</strong><br>${noContrato}</div>
                    <div><strong style="color: #00796B;">Clave:</strong><br>${clavePres}</div>
                    <div><strong style="color: #00796B;">Tipo:</strong><br>${tipoProy}</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                    <div style="background-color: #E0F7FA; padding: 5px; text-align: center; border: 1px solid #B2EBF2;">
                        <strong style="color: #006064; font-size: 11px; display: block;">Físico</strong>
                        <span style="font-weight: 800; font-size: 14px; color: #006064;">${avanceFis}%</span>
                    </div>
                    <div style="background-color: #F1F8E9; padding: 5px; text-align: center; border: 1px solid #DCEDC8;">
                        <strong style="color: #33691E; font-size: 11px; display: block;">Finan.</strong>
                        <span style="font-weight: 800; font-size: 14px; color: #33691E;">${avanceFin}%</span>
                    </div>
                </div>
                <div style="background: #E0F2F1; text-align: right; padding: 8px; font-weight: bold; color: #00695C;">Monto: ${montoFormat}</div>
            </div>
        </div>
    `;
}