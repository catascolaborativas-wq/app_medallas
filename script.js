const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747';
const GID_BBDD = '0';

// CARGA INICIAL
async function init() {
    console.log("Iniciando carga de APP MEDALLAS...");
    try {
        const [respuestaR, respuestaB] = await Promise.all([
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`),
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_BBDD}`)
        ]);
        const dataR = (await respuestaR.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        const dataB = (await respuestaB.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        
        // Cargar los dos orígenes de datos en paralelo para ahorrar tiempo
        renderCharts(dataR);
        renderMedallas(dataB.slice(1).filter(f => f[0]));
        console.log("Carga completa y exitosa.");
    } catch (e) { 
        console.error("Error cargando datos:", e); 
        document.getElementById('rejilla-medallero').innerHTML = '<p style="color:red; text-align:center;">Error cargando datos. Revisa la consola.</p>';
    }
}

// FUNCIÓN PARA DIBUJAR LOS GRÁFICOS
function renderCharts(f) {
    Chart.defaults.color = '#333'; // Texto oscuro para gráficos sobre blanco
    const colors = ['#f7c32f', '#e32c6c', '#00a8cc', '#ffffff'];

    // 1. Top 15 Cervecerías
    new Chart(document.getElementById('graficoCervecerias'), { type: 'bar', data: { labels: f.slice(1,16).map(i=>i[0]), datasets: [{data: f.slice(1,16).map(i=>parseInt(i[1])), backgroundColor: colors[0]}] }, options: {indexAxis: 'y', responsive: true, maintainAspectRatio: false} });
    // 2. Estilos
    new Chart(document.getElementById('graficoEstilos'), { type: 'pie', data: { labels: f.slice(1,11).map(i=>i[3]), datasets: [{data: f.slice(1,11).map(i=>parseInt(i[4])), backgroundColor: colors}] }, options: {responsive: true, maintainAspectRatio: false} });
    // 3. NUEVO: Top 11 Países (Corregido según la nueva fórmula de columna G e H del Resumen)
    new Chart(document.getElementById('graficoPaises'), { type: 'bar', data: { labels: f.slice(1,12).map(i=>i[6]), datasets: [{data: f.slice(1,12).map(i=>parseInt(i[7])), backgroundColor: colors[1]}] }, options: {responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false}}} });
}

// FUNCIÓN PARA EL MEDALLERO (Lógica recuperada y blindada)
function renderMedallas(m) {
    const contenedor = document.getElementById('rejilla-medallero');
    contenedor.innerHTML = "";
    m.forEach((medalla, index) => {
        try {
            const certamen = medalla[0] ? medalla[0].trim() : "Certamen Desconocido";
            const cerveceria = medalla[1] ? medalla[1].trim() : "Cervecería Anónima";
            const cerveza = medalla[2] ? medalla[2].trim() : "Cerveza Desconocida";
            const tipoMedalla = medalla[4] ? medalla[4].trim() : "Medalla";
            const pais = medalla[6] ? medalla[6].trim() : "País";
            const url = medalla[7] ? medalla[7].trim() : "#"; // Link de la pestaña URL (Col H en BBDD)

            const card = document.createElement('a');
            card.className = 'card-medalla';
            card.href = url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";

            card.innerHTML = `
                <div class="logo-container">
                    <img src="logos_cervezas/${cerveceria}.png" class="logo-cerveza" alt="${cerveceria}" onerror="this.src='logos_cervezas/default.png';">
                </div>
                <img src="logos_certamenes/${certamen}.png" class="logo-certamen" onerror="this.src='logos_certamenes/default.png';">
                
                <p><strong>${cerveceria}</strong></p>
                <p>${cerveza}</p>
                <p><strong>${tipoMedalla}</strong> en ${certamen} (${pais})</p>
            `;
            contenedor.appendChild(card);
        } catch (err) {
            console.warn(`Error procesando medalla #${index + 1}:`, err);
        }
    });
}
init();
