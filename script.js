async function iniciarApp() {
    try {
        const [resM, resC] = await Promise.all([
            fetch('BBDD_Medallero.csv'),
            fetch('BBDD_Certamenes.csv')
        ]);
        const dataM = await resM.text();
        const dataC = await resC.text();

        // 1. PROCESAR GRÁFICOS (Medallero)
        const filasM = dataM.split(/\r?\n/).slice(1);
        const cervecerias = {};
        const gruposEstilos = { "IPA": 0, "STOUT": 0, "LAGER": 0, "SOUR": 0 };

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

        // 2. PROCESAR LOGOS CON LINKS (Certámenes)
        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            let nombreBase = col ? col[0].trim() : "Pendiente";
            let linkCertamen = col && col[1] ? col[1].trim() : "#";
            
            const div = document.createElement('div');
            div.className = 'slot';

            // CASO ESPECIAL BIOBIO: Forzamos la extensión .PNG en mayúsculas como está en tu GitHub
            let extension = (nombreBase.includes("BioBio")) ? ".PNG" : ".png";

            if (nombreBase === "") nombreBase = "Pendiente";

            // Si hay link, envolvemos en un <a>, si no, solo la imagen
            const htmlImagen = `
                <img src="${nombreBase}${extension}" 
                     alt="${nombreBase}" 
                     style="width:90%; height:90%; object-fit:contain;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span style="display:none; font-size:9px; color:#666;">${nombreBase}</span>
            `;

            if (linkCertamen !== "#" && linkCertamen !== "") {
                div.innerHTML = `<a href="${linkCertamen}" target="_blank" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${htmlImagen}</a>`;
            } else {
                div.innerHTML = htmlImagen;
            }
            
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
