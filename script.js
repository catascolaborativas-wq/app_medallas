async function iniciar() {
    try {
        const [resM, resC] = await Promise.all([
            fetch('BBDD_Medallero.csv'),
            fetch('BBDD_Certamenes.csv')
        ]);
        const dataM = await resM.text();
        const dataC = await resC.text();

        const filasM = dataM.split(/\r?\n/).slice(1);
        const cervecerias = {};
        const gruposEstilos = { "IPA": 0, "STOUT": 0, "LAGER": 0, "SOUR": 0 };

        filasM.forEach(f => {
            const c = f.split(/[;,]/);
            const medalla = c[6]?.trim().toUpperCase(); // Columna G
            
            // Solo procesamos si hay medalla (ORO, PLATA, BRONCE o similar)
            if (medalla && medalla !== "" && medalla !== "MEDALLA") {
                
                // 1. Conteo para Ranking de Cervecerías (Columna D)
                const cerv = c[3]?.trim(); 
                if (cerv) {
                    cervecerias[cerv] = (cervecerias[cerv] || 0) + 1;
                }

                // 2. Conteo para Grupos de Estilos (Columna F)
                const estiloTexto = c[5]?.toUpperCase() || "";
                if (estiloTexto.includes("IPA")) gruposEstilos["IPA"]++;
                else if (estiloTexto.includes("STOUT")) gruposEstilos["STOUT"]++;
                else if (estiloTexto.includes("LAGER")) gruposEstilos["LAGER"]++;
                else if (estiloTexto.includes("SOUR")) gruposEstilos["SOUR"]++;
            }
        });

        renderBarras('chart-breweries', cervecerias);
        renderTorta('chart-styles', gruposEstilos);

        // 3. Procesar Logos del Footer
        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            const nombreBase = col ? col[0].trim() : "Pendiente";
            const div = document.createElement('div');
            div.className = 'slot';

            if (nombreBase !== "Pendiente" && nombreBase !== "") {
                // Buscamos la imagen exacta (ej: BioBio Beer Cup - Chile.png)
                div.innerHTML = `<img src="${nombreBase}.png" onerror="this.parentElement.innerHTML='<span>${nombreBase}</span>'" style="max-width:90%; max-height:90%; object-fit:contain;">`;
            } else {
                div.innerHTML = `<span>Pendiente</span>`;
            }
            grid.appendChild(div);
        }
    } catch (e) { console.log("Error:", e); }
}

function renderBarras(id, data) {
    const cont = document.getElementById(id);
    const sort = Object.entries(data).sort((a,b) => b[1] - a[1]).slice(0, 10);
    if (sort.length === 0) { cont.innerHTML = "Sin datos"; return; }
    const max = sort[0][1];
    
    cont.innerHTML = sort.map(([n, v]) => `
        <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:bold">
                <span>${n}</span><span>${v} Medallas</span>
            </div>
            <div style="background:#eee;height:12px;border-radius:6px;overflow:hidden;margin-top:4px">
                <div style="background:#d63384;width:${(v/max)*100}%;height:100%;transition:width 1s"></div>
            </div>
        </div>`).join('');
}

function renderTorta(id, data) {
    const cont = document.getElementById(id);
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) { cont.innerHTML = "Sin datos de estilos"; return; }

    // Renderizamos una leyenda simple que simula la distribución
    cont.innerHTML = Object.entries(data).map(([estilo, cant]) => {
        const porc = ((cant / total) * 100).toFixed(1);
        return `
            <div style="display:flex; align-items:center; margin-bottom:8px">
                <div style="width:15px; height:15px; background:#d63384; opacity:${cant/total + 0.2}; margin-right:10px; border-radius:3px"></div>
                <div style="flex-grow:1; font-size:13px">${estilo}: <b>${cant}</b> (${porc}%)</div>
            </div>
        `;
    }).join('');
}

iniciar();
