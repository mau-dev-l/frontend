// frontend/js/modules/search.js

export function setupSearch(map, capas) {
    console.log("🔍 Módulo de búsqueda inteligente iniciado");

    // ==========================================
    // 1. BUSCADOR INTELIGENTE (Colonias)
    // ==========================================
    const inputData = document.getElementById('data-input');
    const btnData = document.getElementById('btn-data-search');
    const errorData = document.getElementById('data-error');

    // Creamos dinámicamente el contenedor de sugerencias si no existe
    let listaSugerencias = document.getElementById('sugerencias-container');
    if (!listaSugerencias && inputData) {
        listaSugerencias = document.createElement('div');
        listaSugerencias.id = 'sugerencias-container';
        listaSugerencias.style.display = 'none'; // Oculto por defecto
        inputData.parentNode.appendChild(listaSugerencias); // Lo insertamos justo debajo del input
    }

    if (inputData && capas.colonias) {
        
        // A. Preparamos los datos (Indexación)
        // Guardamos nombre y capa de cada colonia para buscar rápido
        const baseDeDatosColonias = [];
        
        capas.colonias.eachLayer(layer => {
            if (layer.feature && layer.feature.properties.nom_asen) {
                baseDeDatosColonias.push({
                    nombre: layer.feature.properties.nom_asen, // Nombre real
                    busqueda: layer.feature.properties.nom_asen.toLowerCase(), // Nombre para buscar (minúsculas)
                    layer: layer // Referencia al dibujo en el mapa
                });
            }
        });

        console.log(`📚 Indexadas ${baseDeDatosColonias.length} colonias para búsqueda.`);

        // B. Función para filtrar y mostrar lista
        inputData.addEventListener('input', function() {
            const texto = this.value.toLowerCase().trim();
            listaSugerencias.innerHTML = ''; // Limpiar lista anterior
            
            if (texto.length === 0) {
                listaSugerencias.style.display = 'none';
                return;
            }

            // Filtramos las coincidencias
            const coincidencias = baseDeDatosColonias.filter(item => 
                item.busqueda.includes(texto)
            );

            if (coincidencias.length > 0) {
                listaSugerencias.style.display = 'block';
                
                // Generamos los elementos de la lista
                coincidencias.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'sugerencia-item';
                    // Resaltar la parte que coincide (Opcional, pero se ve pro)
                    // Simplemente mostramos el nombre original
                    div.textContent = item.nombre; 

                    // Al hacer clic en una opción
                    div.addEventListener('click', () => {
                        inputData.value = item.nombre; // Poner nombre completo en input
                        listaSugerencias.style.display = 'none'; // Ocultar lista
                        seleccionarColonia(item.layer); // Ir al mapa
                    });

                    listaSugerencias.appendChild(div);
                });
            } else {
                listaSugerencias.style.display = 'none';
            }
        });

        // C. Ocultar lista si haces clic fuera
        document.addEventListener('click', (e) => {
            if (e.target !== inputData && e.target !== listaSugerencias) {
                listaSugerencias.style.display = 'none';
            }
        });

        // D. Función para ir al lugar (Zoom + Resaltado)
        function seleccionarColonia(layer) {
            if (errorData) errorData.textContent = "";

            // Zoom
            map.fitBounds(layer.getBounds());
            
            // Popup
            layer.openPopup();

            // Efecto visual (Flash Amarillo)
            const estiloOriginal = layer.options.style;
            layer.setStyle({ color: '#ffd700', weight: 4, fillOpacity: 0.6 });
            
            setTimeout(() => {
                capas.colonias.resetStyle(layer);
            }, 3000);
        }

        // Botón "Buscar" (Por si el usuario prefiere escribir y dar clic)
        // Busca coincidencia exacta o la primera parcial
        if (btnData) {
            btnData.addEventListener('click', () => {
                const texto = inputData.value.toLowerCase().trim();
                const encontrado = baseDeDatosColonias.find(item => item.busqueda === texto) || 
                                   baseDeDatosColonias.find(item => item.busqueda.includes(texto));
                
                if (encontrado) {
                    seleccionarColonia(encontrado.layer);
                    listaSugerencias.style.display = 'none';
                } else {
                    if(errorData) errorData.textContent = "Colonia no encontrada.";
                }
            });
        }
    }

    // ==========================================
    // 2. BUSCADOR POR COORDENADAS (Se mantiene igual)
    // ==========================================
    const btnCoord = document.getElementById('btn-coord-search');
    const inputCoord = document.getElementById('coord-input');
    const errorCoord = document.getElementById('coord-error');

    if (btnCoord && inputCoord) {
        const buscarCoordenada = () => {
            const texto = inputCoord.value.trim();
            if (errorCoord) errorCoord.textContent = "";
            const partes = texto.split(',').map(n => parseFloat(n));

            if (partes.length === 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
                const [lat, lon] = partes;
                if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                    if(errorCoord) errorCoord.textContent = "Coordenadas fuera de rango.";
                    return;
                }
                map.flyTo([lat, lon], 18, { duration: 1.5 });
                L.marker([lat, lon]).addTo(map).bindPopup(`<b>Ubicación:</b><br>${lat}, ${lon}`).openPopup();
            } else {
                if(errorCoord) errorCoord.textContent = "Formato: Lat, Lon";
            }
        };

        btnCoord.addEventListener('click', buscarCoordenada);
        inputCoord.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscarCoordenada(); });
    }
}