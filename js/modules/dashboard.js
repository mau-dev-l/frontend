import { API_URL } from '../config.js';

export async function initDashboard() {
    console.log("Iniciando Dashboard (2023 - 2024 - 2025)...");

    const btnAbrir = document.getElementById('btn-abrir-dashboard');
    const modalDashboard = new bootstrap.Modal(document.getElementById('modalDashboard'));
    
    // KPIs
    const kpi2025 = document.getElementById('kpi-total-2025'); // Nuevo
    const kpi2024 = document.getElementById('kpi-total-2024');
    const kpi2023 = document.getElementById('kpi-total-2023');

    async function actualizarDashboard() {
        try {
            const response = await fetch(`${API_URL}/visop/estadisticas/obras`);
            if (!response.ok) throw new Error("Error al obtener estadísticas");

            const datos = await response.json();
            
            // --- 2025 ---
            // Aseguramos que el array exista con || []
            const data25 = datos.anio_2025 || [];
            const total25 = data25.reduce((acc, item) => acc + item.value, 0);
            const etiquetas25 = data25.map(d => d.label);
            const valores25 = data25.map(d => d.value);

            // --- 2024 ---
            const data24 = datos.anio_2024 || [];
            const total24 = data24.reduce((acc, item) => acc + item.value, 0);
            const etiquetas24 = data24.map(d => d.label);
            const valores24 = data24.map(d => d.value);

            // --- 2023 ---
            const data23 = datos.anio_2023 || [];
            const total23 = data23.reduce((acc, item) => acc + item.value, 0);
            const etiquetas23 = data23.map(d => d.label);
            const valores23 = data23.map(d => d.value);

            // Actualizar KPIs
            if (kpi2025) kpi2025.innerText = total25;
            if (kpi2024) kpi2024.innerText = total24;
            if (kpi2023) kpi2023.innerText = total23;

            // Renderizar Gráficas
            // 2025: Tonos Dorados/Amarillos
            renderizarGrafica('chart-pie-2025', etiquetas25, valores25, 'Obras 2025', ['#FFD700', '#DAA520', '#B8860B', '#F0E68C']);
            
            // 2024: Tonos Azules
            renderizarGrafica('chart-pie-2024', etiquetas24, valores24, 'Obras 2024', ['#0077b6', '#0096c7', '#48cae4', '#90e0ef']);
            
            // 2023: Tonos Tierra/Verdes
            renderizarGrafica('chart-pie-2023', etiquetas23, valores23, 'Obras 2023', ['#2a9d8f', '#264653', '#e9c46a', '#f4a261']);

            console.log("✅ Estadísticas actualizadas (3 años).");

        } catch (error) {
            console.error("❌ Error cargando dashboard:", error);
            if (kpi2025) kpi2025.innerText = "-";
        }
    }

    function renderizarGrafica(divId, etiquetas, valores, titulo, colores) {
        // Verificar si el div existe antes de intentar pintar
        if (!document.getElementById(divId)) return;

        const data = [{
            values: valores,
            labels: etiquetas,
            type: 'pie',
            textinfo: 'percent', // Solo porcentaje para que no se amontone
            textposition: 'inside',
            automargin: true,
            marker: { colors: colores }
        }];

        const layout = {
            title: { text: titulo, font: { size: 16 } },
            height: 300, 
            margin: { t: 40, b: 20, l: 10, r: 10 },
            showlegend: true,
            legend: { orientation: 'h', y: -0.1 } // Leyenda abajo horizontal
        };

        const config = { responsive: true, displayModeBar: false };

        Plotly.newPlot(divId, data, layout, config);
    }

    // EVENTOS
    if (btnAbrir) {
        btnAbrir.addEventListener('click', () => {
            modalDashboard.show();
            setTimeout(actualizarDashboard, 200); 
        });
    }

    // Carga inicial silenciosa
    actualizarDashboard();
}