// frontend/js/modules/gps.js

export function setupGPS(map) {
    console.log("🛰️ Módulo GPS iniciado (Con Limpieza Mutua)");

    const btnGPS = document.getElementById('btn-native-gps');
    const btnClean = document.getElementById('btn-clean-gps');

    if (!btnGPS) return;

    let userMarker = null;
    let userCircle = null;

    // --- 1. FUNCIÓN GLOBAL PARA LIMPIAR GPS (Accesible desde SearchCoords) ---
    window.limpiarGPS = function() {
        if (userMarker) {
            map.removeLayer(userMarker);
            userMarker = null;
        }
        if (userCircle) {
            map.removeLayer(userCircle);
            userCircle = null;
        }
        
        // Ocultar botón de limpieza
        if (btnClean) btnClean.style.display = 'none';
        
        // Restaurar estado del botón principal
        btnGPS.disabled = false;
        btnGPS.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Mi Ubicación (GPS)';
        
        console.log("🧹 GPS limpiado.");
    };

    // --- 2. ACTIVAR GPS ---
    btnGPS.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        // 🔥 LIMPIEZA MUTUA: Si hay una búsqueda activa, la borramos
        if (window.limpiarBusqueda) window.limpiarBusqueda();

        // Limpiar rastro GPS anterior propio si existiera
        window.limpiarGPS();

        // Feedback visual
        const originalContent = '<i class="fa-solid fa-location-crosshairs"></i> Mi Ubicación (GPS)';
        btnGPS.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ubicando...';
        btnGPS.disabled = true;

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log(`📍 GPS encontrado: ${latitude}, ${longitude}`);

                // Volar al punto
                map.flyTo([latitude, longitude], 18, { duration: 1.5 });

                // Crear marcador y círculo
                userMarker = L.marker([latitude, longitude]).addTo(map)
                    .bindPopup(`
                        <div style="text-align:center;">
                            <strong>¡Estás aquí!</strong><br>
                            <small>Precisión: ±${Math.round(accuracy)} m</small>
                        </div>
                    `)
                    .openPopup();

                userCircle = L.circle([latitude, longitude], {
                    color: '#136f63',
                    fillColor: '#136f63',
                    fillOpacity: 0.2,
                    radius: accuracy
                }).addTo(map);

                // Mostrar botón de limpieza
                if (btnClean) btnClean.style.display = 'block';

                // Restaurar botón principal
                btnGPS.innerHTML = originalContent;
                btnGPS.disabled = false;
            },
            (error) => {
                console.warn(`❌ Error GPS: ${error.message}`);
                let msg = "No se pudo obtener tu ubicación.";
                if (error.code === 1) msg = "⚠️ Permiso denegado.";
                
                alert(msg);
                btnGPS.innerHTML = originalContent;
                btnGPS.disabled = false;
            },
            options
        );
    });

    // --- 3. BOTÓN LIMPIAR ---
    if (btnClean) {
        btnClean.addEventListener('click', () => {
            window.limpiarGPS();
        });
    }
}