import { API_URL } from '../config.js';

export function initEditor(map) {
    console.log("✏️ Inicializando Editor...");

    const switchEdicion = document.getElementById('switchEdicion');
    const panelSelector = document.getElementById('panel-selector-capa');
    const modalElement = document.getElementById('modalEdicion');
    const btnGuardar = document.getElementById('btn-guardar-edicion');
    
    if (!switchEdicion || !modalElement) return;

    const modalEdicion = new bootstrap.Modal(modalElement);
    
    // Variables de control
    let drawControl = null;
    let drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    let layerActual = null; // Guardará el dibujo temporalmente

    // 1. Activar/Desactivar Modo Edición
    switchEdicion.addEventListener('change', (e) => {
        if (e.target.checked) {
            panelSelector.style.display = 'block';
            activarHerramientasDibujo(map, drawnItems);
        } else {
            panelSelector.style.display = 'none';
            desactivarHerramientasDibujo(map);
        }
    });

    // 2. Función para activar Leaflet.Draw
    function activarHerramientasDibujo(map, capaDibujos) {
        if (drawControl) map.removeControl(drawControl);

        drawControl = new L.Control.Draw({
            position: 'topleft',
            draw: {
                marker: true,    // Permitimos puntos
                polyline: false, // Por ahora desactivados para simplificar
                polygon: false,
                circle: false,
                rectangle: false,
                circlemarker: false
            },
            edit: {
                featureGroup: capaDibujos, // Donde se guardan los dibujos
                remove: true
            }
        });
        map.addControl(drawControl);
    }

    function desactivarHerramientasDibujo(map) {
        if (drawControl) map.removeControl(drawControl);
        drawnItems.clearLayers(); // Limpiamos dibujos temporales
    }

    // 3. EVENTO: Cuando el usuario termina de dibujar
    map.on(L.Draw.Event.CREATED, function (e) {
        layerActual = e.layer;
        drawnItems.addLayer(layerActual);

        // Extraemos la geometría GeoJSON
        const geojson = layerActual.toGeoJSON();
        document.getElementById('inputEditGeom').value = JSON.stringify(geojson.geometry);

        // Abrimos el Modal para llenar datos
        modalEdicion.show();
    });

    // 4. GUARDAR: Enviar datos a FastAPI
    btnGuardar.addEventListener('click', async () => {
        const colonia = document.getElementById('inputEditColonia').value;
        const nombre = document.getElementById('inputEditObra').value;
        const aprobacion = document.getElementById('inputEditAprob').value;
        const geomString = document.getElementById('inputEditGeom').value;

        if (!colonia || !nombre) {
            alert("Por favor completa Colonia y Nombre.");
            return;
        }

        // Feedback visual (Loading)
        const textoOriginal = btnGuardar.innerHTML;
        btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
        btnGuardar.disabled = true;

        try {
            // Objeto a enviar (Coincide con el modelo Pydantic de Python)
            const payload = {
                colonia: colonia,
                nombre_obra: nombre,
                num_aprobacion: aprobacion,
                geometry: JSON.parse(geomString)
            };

            // PETICIÓN POST A TU API
            const response = await fetch(`${API_URL}/visop/obras/crear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error en el servidor");
            }

            const data = await response.json();
            alert(`✅ ¡Guardado! ID: ${data.id}`);

            // Éxito: Cerrar modal y limpiar
            modalEdicion.hide();
            document.getElementById('form-edicion').reset();
            
            // Opcional: Cambiar color del punto a verde para indicar éxito
            if (layerActual && layerActual.setIcon) {
                // Podrías poner un icono verde aquí
            }

        } catch (error) {
            console.error(error);
            alert("❌ Error al guardar: " + error.message);
        } finally {
            btnGuardar.innerHTML = textoOriginal;
            btnGuardar.disabled = false;
        }
    });
}