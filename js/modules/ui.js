// Este módulo conecta los interruptores (switches) del HTML con las capas del Mapa

export function setupSidebarControls(map, capas) {
    console.log("🎛️ Configurando controles del Sidebar...");

    const controles = {
        'checkFAISMUN2025': capas.faismun2025, // <--- NUEVO
        'checkFAISMUN': capas.faismun2024,
        'checkFAISMUNLineas': capas.faismunLineas,
        'checkFAISMUN2023': capas.faismun2023,
        'checkColonias': capas.colonias,
        'checkZAP': capas.zap,
        'checkManzanas': capas.manzanas,
        'checkPrediosCB01': capas.predios,
        'checkLimiteMunicipal': capas.limite,
        'checkPIM2025': capas.pim2025 ,// 
        'checkParques': capas.parques_mun,
        'checkRutas': capas.Rutas_Tuxtla
    };

    // 1. Apagar el switch maestro "Todas"
    const checkAllFais = document.getElementById('checkFAISMUN_All');
    if (checkAllFais) {
        checkAllFais.checked = false; // Forzar apagado visual
    }

    // 2. Recorrer cada control
    for (const [idCheckbox, capa] of Object.entries(controles)) {
        const checkbox = document.getElementById(idCheckbox);

        if (checkbox && capa) {
            
            // --- REINICIO FORZADO ---
            // Ponemos el switch en OFF aunque el navegador recuerde otra cosa
            // EXCEPCIÓN: Si queremos que el 2025 inicie prendido, quitamos esto para él.
            // Pero por consistencia, lo dejamos controlado por el HTML 'checked'.
            
            // Si por alguna razón la capa está en el mapa, la quitamos (limpieza inicial)
            if (!checkbox.checked && map.hasLayer(capa)) {
                map.removeLayer(capa);
            }
            if (checkbox.checked && !map.hasLayer(capa)) {
                map.addLayer(capa);
            }
            // ------------------------

            // Escuchar cambios (Click del usuario)
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    map.addLayer(capa);
                    console.log(`Capa activada: ${idCheckbox}`);
                } else {
                    map.removeLayer(capa);
                    console.log(`Capa desactivada: ${idCheckbox}`);
                }
            });

            // Sincronización Inversa (Si se quita desde el control nativo)
            map.on('layeradd layerremove', () => {
                checkbox.checked = map.hasLayer(capa);
            });
        }
    }
    
    // Lógica del Botón Maestro "FAISMUN (Todas)"
    if (checkAllFais) {
        checkAllFais.addEventListener('change', (e) => {
            const estado = e.target.checked;
            // Disparamos el evento click en los hijos para reciclar la lógica
            // Agregamos 'checkFAISMUN2025' a la lista
            const hijos = ['checkFAISMUN2025', 'checkFAISMUN', 'checkFAISMUNLineas', 'checkFAISMUN2023'];
            hijos.forEach(id => {
                const cb = document.getElementById(id);
                // Solo cambiamos si el estado actual es distinto al deseado
                if (cb && cb.checked !== estado) {
                    cb.click(); 
                }
            });
        });
    }
}