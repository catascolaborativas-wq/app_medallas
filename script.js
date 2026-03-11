const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const rows = Array.from(doc.querySelectorAll('table tr')).slice(1);

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

        // Esto inyecta los datos en tus cuadros blancos
        actualizarCuadro('Ranking de Cervecerías', stats.cervecerias);
        actualizarCuadro('Estilos más Premiados', stats.estilos);

    } catch (e) {
        console.error("Error en la carga");
    }
}

function actualizarCuadro(tituloTexto, datos) {
    const divs = Array.from(document.querySelectorAll('div'));
    const contenedor = divs.find(d => d.innerText.includes(tituloTexto) && d.children.length === 0) || 
                       divs.find(d => d.innerText.includes(tituloTexto));

    if (contenedor) {
        const ordenado = Object.entries(datos).sort((a, b) => b[1] - a[1]).slice(0, 8);
        let html = `<h3 style="margin-bottom:15px">${tituloTexto}</h3>`;
        ordenado.forEach(([name, count]) => {
            const porcentaje = (count / ordenado[0][1]) * 100;
            html += `
                <div style="margin-bottom:10px">
                    <div style="display:flex;justify-content:space-between;font-size:12px">
                        <span>${name}</span><b>${count}</b>
                    </div>
                    <div style="background:#eee;height:8px;border-radius:4px">
                        <div style="background:#d63384;width:${porcentaje}%;height:100%;border-radius:4px"></div>
                    </div>
                </div>`;
        });
        contenedor.innerHTML = html;
    }
}

loadData();
