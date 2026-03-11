async function iniciarApp() {
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

        // 1. PROCESAR MEDALLAS (Ranking y Estilos)
        filasM.forEach(f => {
            const c = f.split(/[;,]/);
            const medalla = c[6]?.trim().toUpperCase(); 
            if (medalla && medalla !== "" && medalla !== "MEDALLA") {
                const cerv = c[3]?.trim();
                if (cerv) cervecerias[cerv] = (cervecerias[cerv] || 0) + 1;

                const estiloTexto = c[5]?.toUpperCase() || "";
                if (estiloTexto.includes("IPA")) gruposEstilos["IPA"]++;
                else if (estiloTexto.includes("STOUT")) gruposEstilos["STOUT"]++;
                else if (estiloTexto.includes("LAGER")) gruposEstilos["LAGER"]++;
                else if (estiloTexto.includes("SOUR")) gruposEstilos["SOUR"]++;
            }
        });

        renderBarras('chart-breweries', cervecerias);
        renderTorta('chart-styles', gruposEstilos);

        // 2. PROCESAR LOGOS (Aquí estaba el fallo)
        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            // Quitamos espacios extra que mete el CSV
            let nombreBase = col ? col[0].trim() : "Pendiente";
            
            const div = document.createElement('div');
            div.className = 'slot';

            // Si es "Pendiente", cargamos Pendiente.png
            // Si es "BioBio Beer Cup - Chile", cargamos BioBio Beer Cup - Chile.png
            if (nombreBase === "") nombreBase = "Pendiente";

            div.innerHTML = `
                <img src="${nombreBase}.png" 
                     alt="${nombreBase}" 
                     style="width:80%; height:80%; object-fit:contain;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span style="display:none; font-size:10px; color:#555;">${nombreBase}.png no hallada</span>
            `;
            
            grid.appendChild(div);
        }
    } catch (e) { console.error("Error técnico:", e); }
}

function renderBarras(id, data) {
    const cont = document.getElementById(id);
    const sort = Object.entries(data).sort((a,b) => b[1] - a[1]).slice(0, 10);
    if (sort.length === 0) return;
    const max = sort[0][1];
    cont.innerHTML = sort.map(([n, v]) => `
        <div style="margin-bottom:10px">
            <div style="display:flex; justify-content:space-between; font-size:12px"><span>${n}</span><b>${v} Medallas</b></div>
            <div style="background:#eee; height:10px; border-radius:5px; overflow:hidden">
                <div style="background:#d63384; width:${(v/max)*100}%; height:100%;"></div>
            </div>
        </div>`).join('');
}

function renderTorta(id, data) {
    const cont = document.getElementById(id);
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) return;
    cont.innerHTML = Object.entries(data).map(([estilo, cant]) => {
        const porc = ((cant / total) * 100).toFixed(1);
        return `<div style="display:flex; align-items:center; margin-bottom:8px">
            <div style="width:12px; height:12px; background:#d63384; opacity:${cant/total + 0.2}; margin-right:8px; border-radius:2px"></div>
            <div style="font-size:12px">${estilo}: <b>${cant}</b> (${porc}%)</div>
        </div>`;
    }).join('');
}

iniciarApp();
