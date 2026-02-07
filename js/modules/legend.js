// frontend/js/modules/legend.js

export function initLegend(map, capas) {
    console.log("🗺️ Iniciando Leyenda Dinámica (Sincronizada)...");

    const container = document.getElementById('leyenda-dinamica');
    const content = document.getElementById('leyenda-content');

    if (!container || !content) return;

    // ============================================================
    // 1. CONFIGURACIÓN DE COLORES
    // ============================================================
    const config = [
        { 
            layer: capas.faismun2025, 
            label: 'Obra 2025', 
            type: 'line',     
            color: '#ce0cae'  // Magenta
        },
        { 
            layer: capas.faismun2024, 
            label: 'Obra 2024', 
            type: 'circle', 
            color: '#0077b6' 
        },
        { 
            layer: capas.faismunLineas, 
            label: 'Obra 2024 (Red)', 
            type: 'line', 
            color: '#0077b6' 
        },
        { 
            layer: capas.faismun2023, 
            label: 'Obra 2023', 
            type: 'circle', 
            color: '#2a9d8f' 
        },
        { 
            layer: capas.colonias, 
            label: 'Colonias', 
            type: 'polygon', 
            color: '#ff7800' 
        },
        { 
            layer: capas.zap, 
            label: 'Zonas Atención (ZAP)', 
            // 🔥 TIPO NUEVO: CONTORNO (HUECO) 🔥
            type: 'polygon-outline', 
            color: '#FF6600'  // Naranja
        },
        { 
            layer: capas.manzanas, 
            label: 'Manzanas', 
            type: 'polygon', 
            color: '#6c757d' 
        },
        { 
            layer: capas.predios, 
            label: 'Predios (Catastro)', 
            type: 'polygon', 
            color: '#8A2BE2' 
        },
        { 
            layer: capas.limite, 
            label: 'Límite Municipal', 
            type: 'line-dashed', 
            color: '#000000' 
        }
    ];

    // 2. Función que redibuja el HTML
    function render() {
        let html = '';
        let visibleCount = 0;

        config.forEach(item => {
            if (item.layer && map.hasLayer(item.layer)) {
                visibleCount++;
                html += `
                    <div class="legend-item">
                        ${getSymbolHTML(item)}
                        <span>${item.label}</span>
                    </div>
                `;
            }
        });

        content.innerHTML = html;
        container.style.display = (visibleCount > 0) ? 'block' : 'none';
    }

    map.on('layeradd layerremove', render);
    render();
}

// Helper para dibujar los iconitos con CSS
function getSymbolHTML(item) {
    let style = '';
    
    if (item.type === 'circle') {
        style = `background-color: ${item.color}; border: 1px solid #fff; border-radius: 50%; width: 12px; height: 12px;`;
    } else if (item.type === 'line') {
        style = `background-color: ${item.color}; height: 4px; width: 18px; border-radius: 2px;`;
    } else if (item.type === 'line-dashed') {
        style = `border-top: 2px dashed ${item.color}; height: 0px; width: 18px;`;
    } else if (item.type === 'polygon') {
        // Cuadrito relleno normal
        style = `background-color: ${item.color}; opacity: 0.6; border: 1px solid ${item.color}; width: 14px; height: 14px;`;
    } else if (item.type === 'polygon-outline') {
        // 🔥 CUADRITO HUECO (Transparente con borde) 🔥
        style = `background-color: transparent; border: 2px solid ${item.color}; width: 14px; height: 14px; box-sizing: border-box;`;
    }

    return `<div style="display: inline-block; margin-right: 8px; vertical-align: middle; ${style}"></div>`;
}