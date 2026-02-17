// frontend/js/app.js

import { initMap } from './modules/mapSetup.js';
import { cargarCapasBackend } from './modules/layers.js';
import { setupSidebarControls } from './modules/ui.js';
import { setupSearch } from './modules/search.js';
import { initDashboard } from './modules/dashboard.js';
// import { initEditor } from './modules/editor.js'; 
import { initDashboardManzanas } from './modules/dashboardManzanas.js';
import { initLegend } from './modules/legend.js'; 
import { setupGPS } from './modules/gps.js'; 
import { initGallery } from './modules/gallery.js'; 
import { setupCoordSearch } from './modules/searchCoords.js';




document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Iniciar Mapa
    const { map, baseLayers } = initMap();

    // 2. Cargar Capas desde GeoServer
    const capasOverlay = await cargarCapasBackend();

    // 3. Crear Control de Capas (Esquina superior derecha) - Solo mapas base
    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

    // 4. Vincular botón Zoom Home
    const btnHome = document.getElementById('btn-zoom-home');
    if(btnHome) {
        btnHome.addEventListener('click', () => {
            map.setView([16.7538, -93.116], 13);
        });
    }


    // 5. Configurar Sidebar (Switches de capas)
    setupSidebarControls(map, capasOverlay);
    


    // 6. Configurar Buscadores (Datos)
    setupSearch(map, capasOverlay);

    // 7. Iniciar Dashboard General (Obras)
    initDashboard();

    // 8. Iniciar Editor (DESHABILITADO)
    // initEditor(map); 

    // 9. Iniciar Dashboard Demográfico (Footer)
    if (capasOverlay.manzanas) {
        initDashboardManzanas(map, capasOverlay.manzanas);
    }

    // 10. Iniciar Leyenda
    initLegend(map, capasOverlay);

    // 11. Iniciar GPS
    setupGPS(map); 

    // 12. Iniciar Galería
    initGallery(); 

    // 13. INICIAR BÚSQUEDA POR COORDENADAS (NUEVO)
    setupCoordSearch(map); // <--- 2. ACTIVAR EL MÓDULO

    console.log("VISOP 2.0 Iniciado Completamente.");
});