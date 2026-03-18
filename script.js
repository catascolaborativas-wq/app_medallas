const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747';
const GID_BBDD = '0';

async function iniciarApp() {
    try {
        const [resR, resB] = await Promise.all([
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`),
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_BBDD}`)
        ]);
        const dataR = (await resR.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        const dataB = (await resB.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        
        dibujarGraficos(dataR);
        dibujarMedallas(dataB.slice(1).filter(f => f[0]));
    } catch (e) { console.error(e); }
}

function dibujarGraficos(f) {
    Chart.defaults.color = '#0c1f2b'; // Texto oscuro para fondo blanco
    const colors = ['#f7c32f', '#e32c6c', '#00a8cc', '#2ecc71'];

    new Chart(document.getElementById('graficoCervecerias'), { type: 'bar', data: { labels: f.slice(1,16).map(i=>i[0]), datasets: [{data: f.slice(1,16).map(i=>parseInt(i[1])), backgroundColor: colors[0]}] }, options: {indexAxis: 'y', responsive: true, maintainAspectRatio: false} });
    new Chart(document.getElementById('graficoEstilos'), { type: 'pie', data: { labels: f.slice(1,11).map(i=>i[3]), datasets: [{data: f.slice(1,11).map(i=>parseInt(i[4])), backgroundColor: colors}] }, options: {responsive: true, maintainAspectRatio: false} });
    new Chart(document.getElementById('graficoPaises'), { type: 'bar', data: { labels: f.slice(1,12).map(i=>i[6]), datasets: [{data: f.slice(1,12).map(i=>parseInt(i[7])), backgroundColor: colors[1]}] }, options: {responsive: true, maintainAspectRatio: false} });
}

function dibujarMedallas(m) {
    const grid = document.getElementById('rejilla-medallero');
    grid.innerHTML = "";
    m.forEach(i => {
        const link = i[7]; // Columna H (URL)
        const tieneLink = link && link.startsWith('http');
        const card = document.createElement('a');
        card.className = 'tarjeta-medalla';
        card.href = tieneLink ? link : '#';
        card.target = tieneLink ? "_blank" : "_self";

        card.innerHTML = `
            <div class="contenedor-logo">
                <img src="logos_cervezas/${i[1]}.png" class="logo-cerveza" onerror="this.src='logos_cervezas/default.png'">
            </div>
            <img src="logos_certamenes/${i[0]}.png" class="logo-certamen" onerror="this.src='logos_certamenes/default.png'">
            <p><strong>${i[1]}</strong></p>
            <p>${i[2]}</p>
            <p class="tipo-medalla">${i[4]}</p>
        `;
        grid.appendChild(card);
    });
}
iniciarApp();
