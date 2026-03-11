async function cargarDatos() {
    try {
        // Leemos ambos archivos CSV
        const [resMedallas, resCertamenes] = await Promise.all([
            fetch('BBDD_Medallero.csv'),
            fetch('BBDD_Certamenes.csv')
        ]);

        const csvMedallas = await resMedallas.text();
        const csvCertamenes = await resCertamenes.text();

        // Procesar Ranking (Gráficos)
        const filasM = csvMedallas.split(/\r?\n/).slice(1);
        const cervs = {};
        const styles = {};

        filasM.forEach(f => {
            const cols = f.split(/[;,]/); // Detecta coma o punto y coma
            if (cols.length >= 3) {
                const c = cols[1]?.trim();
                const s = cols[2]?.trim();
                if (c) cervs[c] = (cervs[c] || 0) + 1;
                if (s) styles[s] = (styles[s] || 0) + 1;
            }
        });

        renderChart('chart-breweries', cervs);
        renderChart('chart-styles', styles);

        // Procesar Logos (Footer)
        const grid = document.getElementById('grid-logos');
        const filasC = csvCertamenes.split(/\r?\n/).slice(1);
        grid.innerHTML = "";

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            const nombre = (col && col[0]) ? col[0].trim() : `Certamen ${i+1}`;
            grid.innerHTML += `<div class="slot"><span>${nombre}</span></div>`;
        }

    } catch (e) {
        console.error("Error cargando archivos CSV");
    }
}

function renderChart(id, data) {
    const container = document.getElementById(id);
    const sorted = Object.entries(data).sort((a,b) => b[1]-a[1]).slice(0, 10);
    if (sorted.length === 0) return;
    const max = sorted[0][1];

    container.innerHTML = sorted.map(([name, val]) => `
        <div class="bar-row">
            <div class="bar-label"><span>${name}</span><b>${val}</b></div>
            <div class="bar-track"><div class="bar-fill" style="width:${(val/max)*100}%"></div></div>
        </div>
    `).join('');
}

cargarDatos();