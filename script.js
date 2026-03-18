const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747';

async function cargarTodo() {
    const url = `https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`;
    try {
        const res = await fetch(url);
        const csv = await res.text();
        const filas = csv.split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));

        // Datos Cervecerías (Col A y B)
        renderChart('graficoCervecerias', 'bar', filas.slice(1, 16).map(f => f[0]), filas.slice(1, 16).map(f => parseInt(f[1]) || 0), true);

        // Datos Estilos (Col D y E)
        renderChart('graficoEstilos', 'pie', filas.slice(1, 11).map(f => f[3]), filas.slice(1, 11).map(f => parseInt(f[4]) || 0), false);

        // Datos Países (Col G y H)
        renderChart('graficoPaises', 'bar', filas.slice(1, 6).map(f => f[6]), filas.slice(1, 6).map(f => parseInt(f[7]) || 0), false);

    } catch (e) { console.error("Error cargando Dashboard:", e); }
}

function renderChart(id, tipo, labels, data, isHorizontal) {
    new Chart(document.getElementById(id), {
        type: tipo,
        data: {
            labels: labels,
            datasets: [{ label: 'Medallas', data: data, backgroundColor: ['#f1c40f', '#e67e22', '#d35400', '#c0392b', '#1abc9c'] }]
        },
        options: { indexAxis: isHorizontal ? 'y' : 'x', responsive: true, maintainAspectRatio: false }
    });
}

cargarTodo();
