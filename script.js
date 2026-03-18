const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU';
const GID_RESUMEN = '2076789747';
const GID_BBDD = '0';

async function init() {
    try {
        const [resResumen, resBBDD] = await Promise.all([
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_RESUMEN}`),
            fetch(`https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=${GID_BBDD}`)
        ]);

        const textResumen = await resResumen.text();
        const textBBDD = await resBBDD.text();

        // 1. Gráficos
        const filasResumen = textResumen.split('\n').map(f => f.split(',').map(c => c.replace(/"/g, '').trim()));
        renderCharts(filasResumen);

        // 2. Medallero con links (Columna H / Indice 7)
        const filasBBDD = textBBDD.split('\n').map(r => r.split(',').map(c => c.replace(/"/g, '').trim()));
        renderMedallas(filasBBDD.slice(1).filter(f => f[0]));

    } catch (e) { console.error("Error:", e); }
}

function renderCharts(filas) {
    const colors = ['#f1c40f', '#e67e22', '#d35400', '#c0392b', '#1abc9c', '#2ecc71', '#3498db'];
    
    new Chart(document.getElementById('graficoCervecerias'), {
        type: 'bar',
        data: { labels: filas.slice(1, 16).map(f => f[0]), datasets: [{ data: filas.slice(1, 16).map(f => parseInt(f[1]) || 0), backgroundColor: colors }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById('graficoEstilos'), {
        type: 'pie',
        data: { labels: filas.slice(1, 11).map(f => f[3]), datasets: [{ data: filas.slice(1, 11).map(f => parseInt(f[4]) || 0), backgroundColor: colors }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('graficoPaises'), {
        type: 'bar',
        data: { labels: filas.slice(1, 6).map(f => f[6]), datasets: [{ data: filas.slice(1, 6).map(f => parseInt(f[7]) || 0), backgroundColor: colors }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderMedallas(medallas) {
    const grid = document.getElementById('medallero-grid');
    grid.innerHTML = "";

    medallas.forEach(m => {
        const card = document.createElement('a');
        card.className = 'card-medalla';
        card.href = m[7] || "#"; // Link columna H
        card.target = "_blank";
        
        card.innerHTML = `
            <div class="logo-container">
                <img src="logos_cervezas/${m[1]}.png" class="logo-cerveza" onerror="this.src='logos_cervezas/default.png'">
            </div>
            <img src="logos_certamenes/${m[0]}.png" class="logo-certamen" onerror="this.style.display='none'">
            <h4>${m[1]} - ${m[2]}</h4>
            <p><strong>${m[4]}</strong> en ${m[0]} (${m[6]})</p>
        `;
        grid.appendChild(card);
    });
}

init();
