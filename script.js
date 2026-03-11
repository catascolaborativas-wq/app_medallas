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

        // RENDERIZADO DE GRÁFICOS
        renderGrafico('chart-breweries', cervecerias, "Medallas");
        renderGrafico('chart-styles', gruposEstilos, "Premios");

        // RENDERIZADO DE LOGOS
        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            let nombre = col ? col[0].trim() : "Pendiente";
            let link = col && col[1] ? col[1].trim() : "#";
            
            // CORRECCIÓN PARA BIOBIO .PNG (Mayúsculas)
            let ext = (nombre.includes("BioBio")) ? ".PNG" : ".png";
            if (nombre === "" || nombre === "Pendiente") { nombre = "Pendiente"; ext = ".png"; }

            const imgHTML = `<img src="${nombre}${ext}" style="width:90%;height:90%;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><span style="display:none;font-size:9px;">${nombre}</span>`;
            
            const div = document.createElement('div');
            div.className = 'slot';
            div.innerHTML = (link !== "#") ? `<a href="${link}" target="_blank" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;">${imgHTML}</a>` : imgHTML;
            grid.appendChild(div);
        }
    } catch (e) { console.log(e); }
}

function renderGrafico(id, data, label) {
    const cont = document.getElementById(id);
    const sort = Object.entries(data).sort((a,b) => b[1]-a[1]);
    if (sort.length === 0) return;
    const max = sort[0][1];
    cont.innerHTML = sort.map(([n, v]) => `
        <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px"><span>${n}</span><b>${v} ${label}</b></div>
            <div style="background:#eee;height:12px;border-radius:6px;overflow:hidden;margin-top:4px">
                <div style="background:#d63384;width:${(v/max)*100}%;height:100%;"></div>
            </div>
        </div>`).join('');
}
iniciarApp();
