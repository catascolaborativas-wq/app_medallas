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

        filasM.forEach(f => {
            const c = f.split(/[;,]/);
            const medalla = c[6]?.trim().toUpperCase(); 
            if (medalla && medalla !== "" && medalla !== "MEDALLA") {
                const cerv = c[3]?.trim();
                if (cerv) cervecerias[cerv] = (cervecerias[cerv] || 0) + 1;
                const est = c[5]?.toUpperCase() || "";
                if (est.includes("IPA")) gruposEstilos["IPA"]++;
                else if (est.includes("STOUT")) gruposEstilos["STOUT"]++;
                else if (est.includes("LAGER")) gruposEstilos["LAGER"]++;
                else if (est.includes("SOUR")) gruposEstilos["SOUR"]++;
            }
        });

        // Llamadas a las funciones de dibujo
        renderBarras('chart-breweries', cervecerias);
        renderTorta('chart-styles', gruposEstilos);

        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            let nombre = col ? col[0].trim() : "Pendiente";
            let link = col && col[1] ? col[1].trim() : "#";
            let ext = (nombre.toLowerCase().includes("biobio")) ? ".PNG" : ".png";
            if (nombre === "" || nombre === "Pendiente") { nombre = "Pendiente"; ext = ".png"; }

            const imgHTML = `<img src="${nombre}${ext}" style="width:90%;height:90%;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><span style="display:none;font-size:10px;">${nombre}</span>`;
            
            const div = document.createElement('div');
            div.className = 'slot';
            div.innerHTML = (link !== "#") ? `<a href="${link}" target="_blank" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;">${imgHTML}</a>` : imgHTML;
            grid.appendChild(div);
        }
    } catch (e) { console.log(e); }
}

function renderBarras(id, data) {
    const cont = document.getElementById(id);
    const sort = Object.entries(data).sort((a,b) => b[1]-a[1]).slice(0, 10);
    if (sort.length === 0) return;
    const max = sort[0][1];
    cont.innerHTML = sort.map(([n, v]) => `
        <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px"><span>${n}</span><b>${v}</b></div>
            <div style="background:#eee;height:10px;border-radius:5px;overflow:hidden;margin-top:4px">
                <div style="background:#d63384;width:${(v/max)*100}%;height:100%;"></div>
            </div>
        </div>`).join('');
}

function renderTorta(id, data) {
    const cont = document.getElementById(id);
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const colores = ["#d63384", "#6610f2", "#fd7e14", "#20c997"]; 
    let acumulado = 0;
    
    const sectores = Object.entries(data).map(([nombre, valor], i) => {
        const porc = (valor / total) * 100;
        if (porc === 0) return "";
        const inicio = acumulado;
        acumulado += porc;
        return `<circle r="16" cx="16" cy="16" fill="transparent" stroke="${colores[i]}" stroke-width="32" stroke-dasharray="${porc} 100" stroke-dashoffset="-${inicio}" />`;
    }).join('');

    const leyenda = Object.entries(data).map(([nombre, valor], i) => `
        <div style="display:flex; align-items:center; margin-top:5px; font-size:12px">
            <div style="width:12px;height:12px;background:${colores[i]};margin-right:8px;border-radius:2px"></div>
            <span>${nombre}: <b>${valor}</b> (${total > 0 ? ((valor/total)*100).toFixed(0) : 0}%)</span>
        </div>`).join('');

    cont.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px">
            <svg viewBox="0 0 32 32" style="width:160px; height:160px; transform: rotate(-90deg); border-radius:50%; background:#f8f9fa;">${sectores}</svg>
            <div style="width:100%">${leyenda}</div>
        </div>`;
}

iniciarApp();
