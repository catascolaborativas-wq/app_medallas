const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const rows = Array.from(doc.querySelectorAll('table tr')).slice(1); // Salta el encabezado

        const stats = { cervecerias: {}, estilos: {} };

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const cerv = cells[1].innerText.trim();
                const estilo = cells[2].innerText.trim();
                if(cerv) stats.cervecerias[cerv] = (stats.cervecerias[cerv] || 0) + 1;
                if(estilo) stats.estilos[estilo] = (stats.estilos[estilo] || 0) + 1;
            }
        });

        renderChart('chart-cervecerias', stats.cervecerias, 'Ranking de Cervecerías');
        renderChart('chart-estilos', stats.estilos, 'Ranking de Estilos');
    } catch (e) {
        console.error("Error cargando datos:", e);
    }
}

function renderChart(containerId, data, title) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    let html = `<h3>${title}</h3>`;
    sorted.forEach(([name, count]) => {
        const width = (count / sorted[0][1]) * 100;
        html += `
            <div style="margin-bottom: 10px;">
                <small>${name} (${count})</small>
                <div style="background: #e9ecef; border-radius: 4px; height: 20px;">
                    <div style="background: #d63384; width: ${width}%; height: 100%; border-radius: 4px;"></div>
                </div>
            </div>`;
    });
    container.innerHTML = html;
}

loadData();
