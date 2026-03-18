const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747';
const GID_BBDD = '0';

async function iniciarApp() {
    try {
        const [respuestaR, respuestaB] = await Promise.all([
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`),
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_BBDD}`)
        ]);
        const datosR = (await respuestaR.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        const datosB = (await respuestaB.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        
        dibujarGraficos(datosR);
        dibujarMedallas(datosB.slice(1).filter(f => f[0]));
    } catch (error) { console.error("Error al cargar:", error); }
}

function dibujarGraficos(f) {
    Chart.defaults.color = '#ffffff';
    const colores = ['#f7c32f', '#e32c6c', '#00a8cc', '#ffffff'];

    new Chart(document.getElementById('graficoCervecerias'), { type: 'bar', data: { labels: f.slice(1,16).map(i=>i[0]), datasets: [{label: 'Medallas', data: f.slice(1,16).map(i=>parseInt(i[1])), backgroundColor: colores[0]}] }, options: {indexAxis: 'y', responsive: true, maintainAspectRatio: false} });
    new Chart(document.getElementById('graficoEstilos'), { type: 'pie', data: { labels: f.slice(1,11).map(i=>i[3]), datasets: [{data: f.slice(1,11).map(i=>parseInt(i[4])), backgroundColor: colores}] }, options: {responsive: true, maintainAspectRatio: false} });
    new Chart(document.getElementById('graficoPaises'), { type: 'bar', data: { labels: f.slice(1,12).map(i=>i[6]), datasets: [{label: 'Total Medallas', data: f.slice(1,12).map(i=>parseInt(i[7])), backgroundColor: colores[1]}] }, options: {responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false}}} });
}

function dibujarMedallas(m) {
    const contenedor = document.getElementById('rejilla-medallero');
    contenedor.innerHTML = "";
    m.forEach(fila => {
        const certamen = fila[0];
        const link = fila[7]; // Columna H en BBDD
        const tieneLink = link && link.startsWith('http');
        
        const tarjeta = document.createElement('a');
        tarjeta.className = 'tarjeta-medalla';
        tarjeta.href = tieneLink ? link : '#';
        tarjeta.target = tieneLink ? "_blank" : "_self";

        const logoCert = tieneLink ? `logos_certamenes/${certamen}.png` : `logos_certamenes/Pendiente.png`;

        tarjeta.innerHTML = `
            <div class="contenedor-logo">
                <img src="logos_cervezas/${fila[1]}.png" class="logo-cerveza" onerror="this.src='logos_cervezas/default.png'">
            </div>
            <img src="${logoCert}" class="logo-certamen" onerror="this.src='logos_certamenes/default.png'">
            <p><strong>${fila[1]}</strong></p>
            <p>${fila[2]}</p>
            <p class="tipo-medalla">${fila[4]}</p>
        `;
        contenedor.appendChild(tarjeta);
    });
}
iniciarApp();
