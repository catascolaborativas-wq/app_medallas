const URL_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kkO1xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSnO4_BNnZ7KOVt1JkbM/pub?output=csv";

async function cargar() {
    const res = await fetch(URL_SHEET);
    const csv = await res.text();
    const filas = csv.split('\n').map(f => f.split(','));
    const headers = filas[0].map(h => h.trim());
    const datos = filas.slice(1).map(f => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = f[i] ? f[i].trim() : "");
        return obj;
    });

    const medallas = datos.filter(d => d["Cervecería"]);
    const urls = datos.filter(d => d["URL"]);

    // Gráfico Cervecerías
    const cConteo = {};
    medallas.forEach(d => { cConteo[d["Cervecería"]] = (cConteo[d["Cervecería"]] || 0) + 1; });
    const cLabels = Object.keys(cConteo).slice(0, 10);
    new Chart(document.getElementById('graficoMedallas'), {
        type: 'bar',
        data: { labels: cLabels, datasets: [{ label: 'Medallas', data: cLabels.map(l => cConteo[l]), backgroundColor: '#e32c6c' }] }
    });

    // Gráfico Estilos
    const eConteo = {};
    medallas.forEach(d => {
        let e = (d["ESTILO"] || "Otros").toUpperCase();
        if (e.includes("IPA")) e = "IPA";
        else if (e.includes("STOUT")) e = "STOUT";
        else if (e.includes("LAGER")) e = "LAGER";
        eConteo[e] = (eConteo[e] || 0) + 1;
    });
    new Chart(document.getElementById('graficoEstilos'), {
        type: 'doughnut',
        data: { labels: Object.keys(eConteo), datasets: [{ data: Object.values(eConteo), backgroundColor: ['#e32c6c', '#0c1f2b', '#4a6d81', '#ff78a7'] }] }
    });

    // Footer 18 logos
    const grid = document.getElementById('footerLogos');
    for (let i = 0; i < 18; i++) {
        const item = urls[i];
        const div = document.createElement('div');
        div.className = 'logo-item';
        const img = (item && item["Link Logo"]) ? item["Link Logo"] : "Pendiente.png";
        const link = (item && item["URL"]) ? item["URL"] : "#";
        div.innerHTML = `<a href="${link}" target="_blank"><img src="${img}" onerror="this.src='Pendiente.png'"></a>`;
        grid.appendChild(div);
    }
}
window.onload = cargar;