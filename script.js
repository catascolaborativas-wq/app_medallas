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

        // 1. Procesar Medallero (Gráficos)
        filasM.forEach(f => {
            // Detecta coma o punto y coma automáticamente
            const c = f.split(/[;,]/);
            
            // Validamos columna G (Índice 6) para asegurar que es una medalla
            const medallaValida = c[6]?.trim().toUpperCase();
            if (medallaValida && medallaValida !== "" && medallaValida !== "MEDALLA") {
                
                // Conteo Cervecerías: Columna D (Índice 3)
                const cerv = c[3]?.trim();
                if (cerv) {
                    cervecerias[cerv] = (cervecerias[cerv] || 0) + 1;
                }

                // Conteo Grupos Estilos: Columna F (Índice 5)
                const estiloTexto = c[5]?.toUpperCase() || "";
                if (estiloTexto.includes("IPA")) gruposEstilos["IPA"]++;
                else if (estiloTexto.includes("STOUT")) gruposEstilos["STOUT"]++;
                else if (estiloTexto.includes("LAGER")) gruposEstilos["LAGER"]++;
                else if (estiloTexto.includes("SOUR")) gruposEstilos["SOUR"]++;
            }
        });

        renderBarras('chart-breweries', cervecerias);
        renderTorta('chart-styles', gruposEstilos);

        // 2. Procesar Certámenes (Logos Footer)
        const grid = document.getElementById('grid-logos');
        const filasC = dataC.split(/\r?\n/).slice(1);
        grid.innerHTML = ""; 

        for (let i = 0; i < 18; i++) {
            const col = filasC[i] ? filasC[i].split(/[;,]/) : null;
            // Usamos el nombre base (ej: BioBio Beer Cup - Chile o Pendiente)
            const nombreBase = col ? col[0].trim() : "Pendiente";
            
            const div = document.createElement('div');
            div.className = 'slot';

            // Si hay nombre base válido y no está vacío
            if (nombreBase && nombreBase !== "") {
                // Buscamos la imagen .png exacta (ej: BioBio Beer Cup - Chile.png)
                // Usamosonerror para mostrar texto si la imagen falla
                div.innerHTML = `<img src="${nombreBase}.png" alt="${nombreBase}" onerror="this.parentElement.innerHTML='<span>${nombreBase}</span>'" style="max-width:90%; max-height:90%; object-fit:contain;">`;
            } else {
                div.innerHTML = `<span>Pendiente</span>`;
            }
            grid.appendChild(div);
        }
    } catch (e) {
        console.error("Error técnico detallado:", e);
    }
}

// Renderizado gráfico de barras
function renderBarras(id, data) {
    const cont = document.getElementById(id);
    const sort = Object.entries(data).sort((a,b) => b[1] - a[1]).slice(0, 10);
    
    if (sort.length === 0) {
        cont.innerHTML = "Sin datos de medallas.";
        return;
    }

    const max = sort[0][1];
    cont.innerHTML = sort.map(([n, v]) => `
        <div style="margin-bottom:10px">
            <div style="display:flex; justify-content:space-between; font-size:12px">
                <span>${n}</span><b>${v} Medallas</b>
            </div>
            <div style="background:#eee; height:10px; border-radius:5px; overflow:hidden">
                <div style="background:#d63384; width:${(v/max)*100}%; height:100%; transition:width 1s"></div>
            </div>
        </div>`).join('');
}

// Renderizado gráfico de torta (leyenda)
function renderTorta(id, data) {
    const cont = document.getElementById(id);
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
        cont.innerHTML = "Sin datos de estilos.";
        return;
    }

    // Renderizamos una leyenda que simula la distribución con opacidad
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

iniciarApp();
