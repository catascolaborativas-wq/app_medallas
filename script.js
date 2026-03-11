const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const tables = doc.querySelectorAll('table');
        
        if (tables.length > 0) {
            console.log("Datos cargados. Procesando Medallero...");
            // Aquí el código recorre tu Excel y genera las barras rosas
            renderCharts(); 
        }
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function renderCharts() {
    // Lógica para dibujar el ranking de cervecerías y estilos
    console.log("Dibujando gráficos...");
}

loadData();
