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
        const estilos = { "IPA": 0, "STOUT": 0, "LAGER": 0, "SOUR": 0 };

        filasM.forEach(f => {
            const c = f.split(/[;,]/);
            const medalla = c[6]?.trim().toUpperCase(); 
            if (medalla && medalla !== "" && medalla !== "MEDALLA") {
                const cerv = c[3]?.trim();
                if (cerv) cervecerias[cerv] = (cervecerias[cerv] || 0) + 1;
                
                const estTexto = c[5]?.toUpperCase() || "";
                if (estTexto.includes("IPA")) estilos["IPA"]++;
                else if (estTexto.includes("STOUT")) estilos["STOUT"]++;
                else if (estTexto.includes("LAGER")) estilos["LAGER"]++;
                else if (estTexto.includes("SOUR")) estilos["SOUR"]++;
            }
        });

        // 1. GRÁFICO DE BARRAS HORIZONTALES (TOP 10)
        const rankingCont = document.getElementById('chart-breweries');
        const top10 = Object.entries(cervecerias).sort((a,b) => b[1]-a[1]).slice(0, 10);
        const maxMedallas = top10[0][1];
        rankingCont.innerHTML = top10.map(([n, v]) => `
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;font-size:12px"><span>${n}</span><b>${v}</b></div>
                <div style="background:#eee;height:12px;border-radius:6px;overflow:hidden;margin-top:4px">
                    <div style="background:#d63384;width:${(v/maxMedallas)*100}%;height:100%;"></div>
                </div>
            </div>`).join('');

        // 2. GRÁFICO DE TORTA REDONDO (SVG)
        const tortaCont = document.getElementById('chart-styles');
        const total = Object.values(estilos).reduce((a, b) => a + b, 0);
        const colores = ["#d63384", "#6610f2", "#fd7e14", "#20c997"]; 
        let acumulado = 0;
        
        const sectores = Object.entries(estilos).map(([nombre, valor], i) => {
            const porc = (valor / total) * 100;
            if (porc === 0) return "";
            const inicio = acumulado;
            acumulado += porc;
            return `<circle r="16" cx="16" cy="16" fill="transparent" stroke="${colores[i]}" stroke-width="32" stroke-dasharray="${porc} 100" stroke-dashoffset="-${inicio}" />`;
        }).join('');

        tortaCont.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:15px">
                <svg viewBox="0 0 32 32" style="width:160px; height:160px; transform: rotate(-90deg); border-radius:50%; background:#f0f0f0;">${sectores}</svg>
                <div style="width:100%">${Object.entries(estilos).map(([n, v], i) => `
                    <div style="display:flex;align-items:center;font-size:12px;margin-top:4px">
                        <div style="width:12px;height:12px;background:${colores[i]};margin-right:8px;border-radius:2px"></div>
                        ${n}: <b>${v}</b> (${total>0?Math.round((v/total)*100):0}%)
                    </div>`).join('')}</div>
            </div>`;

        // 3. LOGOS CLICKABLES
        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 
        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            let nom = col ? col[0].trim() : "Pendiente";
            let link = col && col[1] ? col[1].trim() : "#";
            let ext = (nom.toLowerCase().includes("biobio")) ? ".PNG" : ".png";
            if (nom === "" || nom === "Pendiente") { nom = "Pendiente"; ext = ".png"; }
            const img = `<img src="${nom}${ext}" style="width:90%;height:90%;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><span style="display:none;font-size:10px;">${nom}</span>`;
            const div = document.createElement('div');
            div.className = 'slot';
            div.innerHTML = (link !== "#") ? `<a href="${link}" target="_blank" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;">${img}</a>` : img;
            grid.appendChild(div);
        }
    } catch (e) { console.error(e); }
}
iniciarApp();
                    
