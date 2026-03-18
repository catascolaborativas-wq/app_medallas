const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747';
const GID_BBDD = '0';

async function init() {
    try {
        const [resR, resB] = await Promise.all([
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`),
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_BBDD}`)
        ]);
        const dataR = (await resR.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        const dataB = (await resB.text()).split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        
        renderCharts(dataR);
        renderMedallas(dataB.slice(1).filter(f => f[0]));
    } catch (e) { console.error(e); }
}

function renderCharts(f) {
    Chart.defaults.color = '#ffffff';
    const colors = ['#f7c32f', '#e32c6c', '#00a8cc', '#2ecc71', '#9b59b6'];

    new Chart(document.getElementById('graficoCervecerias'), { type: 'bar', data: { labels: f.slice(1,16).map(i=>i[0]), datasets: [{data: f.slice(1,16).map(i=>parseInt(i[1])), backgroundColor: colors[0]}] }, options: {indexAxis: 'y', responsive: true, maintainAspectRatio: false} });
    new Chart(document.getElementById('graficoEstilos'), { type: 'pie', data: { labels: f.slice(1,11).map(i=>i[3]), datasets: [{data: f.slice(1,11).map(i=>parseInt(i[4])), backgroundColor: colors}] }, options: {responsive: true, maintainAspectRatio: false} });
    
    // Gráfico de 11 Países (Columna I en BBDD, procesada en G y H del Resumen)
    new Chart(document.getElementById('graficoPaises'), { type: 'bar', data: { labels: f.slice(1,12).map(i=>i[6]), datasets: [{data: f.slice(1,12).map(i=>parseInt(i[7])), backgroundColor: colors[1]}] }, options: {responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false}}} });
}

function renderMedallas(m) {
    const grid = document.getElementById('medallero-grid');
    grid.innerHTML = "";
    m.forEach(i => {
        const link = i[7]; // Columna H (URL)
        const hasLink = link && link.startsWith('http');
        const card = document.createElement('a');
        card.className = 'card-medalla';
        card.href = hasLink ? link : '#';
        card.target = hasLink ? "_blank" : "_self";

        card.innerHTML = `
            <div class="logo-container">
                <img src="logos_cervezas/${i[1]}.png" class="logo-cerveza" onerror="this.src='logos_cervezas/default.png'">
            </div>
            <img src="${hasLink ? 'logos_certamenes/' + i[0] + '.png' : 'logos_certamenes/Pendiente.png'}" 
                 class="logo-certamen" onerror="this.src='logos_certamenes/default.png'">
            <p><strong>${i[1]}</strong></p>
            <p>${i[2]}</p>
            <p style="color:#e32c6c; font-weight:bold;">${i[4]}</p>
        `;
        grid.appendChild(card);
    });
}
init();
