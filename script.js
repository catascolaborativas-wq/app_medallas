const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747'; // Hoja de Gráficos
const GID_BBDD = '0'; // ID de tu hoja principal BBDD

async function cargarPaginaCompleta() {
    try {
        // 1. CARGAR GRÁFICOS
        const resResumen = await fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`);
        const csvResumen = await resResumen.text();
        const filasResumen = csvResumen.split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        renderizarGraficos(filasResumen);

        // 2. CARGAR MEDALLERO (Logos y Links)
        const resBBDD = await fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_BBDD}`);
        const csvBBDD = await resBBDD.text();
        const medallas = csvBBDD.split('\n').slice(1).map(f => f.split(','));
        renderizarMedallero(medallas);

    } catch (e) { console.error("Error general:", e); }
}

function renderizarGraficos(filas) {
    // Top 15 Cervecerías
    crearChart('graficoCervecerias', 'bar', filas.slice(1, 16).map(f => f[0]), filas.slice(1, 16).map(f => parseInt(f[1])), true, 'Top 15 Cervecerías');
    // Estilos
    crearChart('graficoEstilos', 'pie', filas.slice(1, 11).map(f => f[3]), filas.slice(1, 11).map(f => parseInt(f[4])), false, 'Top 10 Estilos');
    // Países
    crearChart('graficoPaises', 'bar', filas.slice(1, 6).map(f => f[6]), filas.slice(1, 6).map(f => parseInt(f[7])), false, 'Top 5 Países');
}

function renderizarMedallero(datos) {
    const contenedor = document.getElementById('medallero');
    contenedor.innerHTML = "";
    
    datos.forEach(fila => {
        if (!fila[0]) return; // Saltarse vacíos
        const card = document.createElement('div');
        card.className = 'card-medalla';
        
        // Aquí vinculamos al link de la pestaña URL (asumiendo que está en la columna correspondiente, ej: columna J)
        const link = fila[9] || "#"; 
        
        card.innerHTML = `
            <a href="${link}" target="_blank">
                <img src="logos_cervezas/${fila[3]}.png" class="logo-cerveza" onerror="this.src='logos_cervezas/default.png'">
                <p><strong>${fila[3]}</strong></p>
                <p>${fila[5]} - ${fila[6]}</p>
                <img src="logos_certamenes/${fila[1]}.png" class="logo-certamen">
            </a>
        `;
        contenedor.appendChild(card);
    });
}

function crearChart(id, tipo, labels, data, horizontal, titulo) {
    new Chart(document.getElementById(id), {
        type: tipo,
        data: {
            labels: labels,
            datasets: [{ label: titulo, data: data, backgroundColor: ['#f1c40f', '#e67e22', '#d35400', '#c0392b', '#1abc9c'] }]
        },
        options: { indexAxis: horizontal ? 'y' : 'x', responsive: true, maintainAspectRatio: false }
    });
}

window.onload = cargarPaginaCompleta;
