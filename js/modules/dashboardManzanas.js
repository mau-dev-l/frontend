// frontend/js/modules/dashboardManzanas.js

export function initDashboardManzanas(map, capaManzanas) {
    console.log("👥 Inicializando Dashboard Demográfico Inteligente...");

    const panel = document.getElementById('panel-demografico');
    const btn = document.getElementById('btn-toggle-demografico');

    if (!panel || !btn) return;

    // 1. Lógica del Botón (Abrir/Cerrar)
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        panel.classList.toggle('activo');
        actualizarIconoBtn(panel, btn);
    });

    // 2. Cargar Totales al inicio
    if (capaManzanas) {
        calcularTotalesCiudad(capaManzanas);
        
        // A) Al hacer CLIC en una manzana
        capaManzanas.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            const props = e.layer.feature.properties;
            mostrarDatosUnicos(props);
            
            if (!panel.classList.contains('activo')) {
                panel.classList.add('activo');
                actualizarIconoBtn(panel, btn);
            }
        });

        // B) Al hacer CLIC en el mapa vacío (Reset)
        map.on('click', () => {
            calcularTotalesCiudad(capaManzanas);
        });
    }
}

// --- FUNCIÓN 1: SUMA TOTAL (TODA LA CIUDAD) ---
function calcularTotalesCiudad(capa) {
    let totalPob = 0;
    let totalMas = 0;
    let totalFem = 0;
    let totalJefa = 0;
    let totalViv = 0;

    capa.eachLayer(layer => {
        const props = layer.feature.properties;
        
        // Sumas con protección contra nulos
        totalPob += parseInt(props.pobtot) || 0;
        totalMas += parseInt(props.pobmas) || 0;
        totalFem += parseInt(props.pobfem) || 0;
        totalViv += parseInt(props.vivtot) || 0;
        
        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Buscamos 'hogjef_f' (minúscula) primero, luego las variantes del INEGI
        totalJefa += parseInt(props.hogjef_f) || parseInt(props.vph_jef_f) || parseInt(props.jefatura_f) || 0; 
    });

    actualizarDOM(totalPob, totalMas, totalFem, totalJefa, totalViv, "Demografía Tuxtla (Total)");
    
    const btn = document.getElementById('btn-toggle-demografico');
    if(btn) btn.style.backgroundColor = "#0077b6"; 
}

// --- FUNCIÓN 2: DATOS INDIVIDUALES (UNA MANZANA) ---
function mostrarDatosUnicos(props) {
    const pob = parseInt(props.pobtot) || 0;
    const mas = parseInt(props.pobmas) || 0;
    const fem = parseInt(props.pobfem) || 0;
    const viv = parseInt(props.vivtot) || 0;
    
    // --- AQUÍ TAMBIÉN ---
    const jefa = parseInt(props.hogjef_f) || parseInt(props.vph_jef_f) || parseInt(props.jefatura_f) || 0;

    // Usamos CVEGEO si existe, si no "manzana", si no un texto genérico
    const idManzana = props.cvegeo || props.manzana || props.id || 'Seleccionada';
    const titulo = `Manzana: ${idManzana}`;

    actualizarDOM(pob, mas, fem, jefa, viv, titulo);

    const btn = document.getElementById('btn-toggle-demografico');
    if(btn) btn.style.backgroundColor = "#e76f51"; 
}

// --- HELPERS (Sin cambios) ---
function actualizarDOM(pob, mas, fem, jefa, viv, tituloBtn) {
    const fmt = new Intl.NumberFormat('es-MX');

    animateValue("kpi-pob-total", pob);
    document.getElementById('kpi-pob-mas').textContent = fmt.format(mas);
    document.getElementById('kpi-pob-fem').textContent = fmt.format(fem);
    document.getElementById('kpi-jefatura').textContent = fmt.format(jefa);
    document.getElementById('kpi-viviendas').textContent = fmt.format(viv);

    const btn = document.getElementById('btn-toggle-demografico');
    if (btn) {
        const iconHTML = btn.querySelector('i').outerHTML; 
        btn.innerHTML = `${iconHTML} ${tituloBtn}`;
    }
}

function animateValue(id, end) {
    const obj = document.getElementById(id);
    if(!obj) return;
    // Reiniciamos el texto para que se note el cambio
    obj.innerHTML = "0"; 
    
    const duration = 800; // Un poco más rápido
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = new Intl.NumberFormat('es-MX').format(Math.floor(progress * end));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function actualizarIconoBtn(panel, btn) {
    const icon = btn.querySelector('i');
    if (panel.classList.contains('activo')) {
        icon.className = 'fa-solid fa-chevron-down';
    } else {
        icon.className = 'fa-solid fa-people-group';
    }
}