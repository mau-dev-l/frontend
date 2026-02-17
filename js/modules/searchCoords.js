// frontend/js/modules/searchCoords.js

export function setupCoordSearch(map) {
    console.log("Módulo Búsqueda Coordenadas iniciado (Con Limpieza Mutua)");

    const input = document.getElementById('coord-input');
    const btnSearch = document.getElementById('btn-coord-search');
    const btnClean = document.getElementById('btn-clean-coords');
    const errorDiv = document.getElementById('coord-error');

    if (!input || !btnSearch) return;

    let searchMarker = null;

    // --- 1. FUNCIÓN GLOBAL PARA LIMPIAR BÚSQUEDA (Accesible desde GPS) ---
    window.limpiarBusqueda = function() {
        // Borrar marcador del mapa
        if (searchMarker) {
            map.removeLayer(searchMarker);
            searchMarker = null;
        }
        
        // Limpiar inputs y errores
        if (input) input.value = '';
        if (errorDiv) errorDiv.innerText = '';
        
        // Ocultar botón de limpieza
        if (btnClean) btnClean.style.display = 'none';
        
        console.log("🧹 Búsqueda limpiada.");
    };

    // --- 2. ACTIVAR BÚSQUEDA ---
    btnSearch.addEventListener('click', () => {
        const raw = input.value.trim();
        errorDiv.innerText = ''; 

        if (!raw) {
            errorDiv.innerText = "Ingresa coordenadas (Lat, Lon).";
            return;
        }

        const parts = raw.split(',');
        if (parts.length !== 2) {
            errorDiv.innerText = "Formato inválido. Usa: Latitud, Longitud";
            return;
        }

        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);

        if (isNaN(lat) || isNaN(lon)) {
            errorDiv.innerText = "Las coordenadas deben ser números.";
            return;
        }

        // LIMPIEZA MUTUA: Si el GPS está activo, lo apagamos
        if (window.limpiarGPS) window.limpiarGPS();

        // Limpiar búsqueda anterior propia
        window.limpiarBusqueda();

        // Restaurar el valor en el input (porque limpiarBusqueda lo borró)
        input.value = raw; 

        // Volar al punto
        map.flyTo([lat, lon], 18, { duration: 1.5 });

        // Crear marcador
        searchMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`
                <div style="text-align:center;">
                    <strong>Coordenada Buscada</strong><br>
                    <small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>
                </div>
            `)
            .openPopup();

        // Mostrar botón de limpieza
        if (btnClean) btnClean.style.display = 'block';
    });

    // --- 3. BOTÓN LIMPIAR ---
    if (btnClean) {
        btnClean.addEventListener('click', () => {
            window.limpiarBusqueda();
            // Opcional: Si quieres un botón de "Limpieza Total" que borre TODO
            // if (window.limpiarGPS) window.limpiarGPS(); 
        });
    }
}