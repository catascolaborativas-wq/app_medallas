const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const tables = doc.querySelectorAll('table');
        
        if (tables.length > 0) {
            // Aquí es donde ocurre la magia que dibuja las barras rosas
            console.log("Tablas encontradas");
            // Nota: Este script asume que tu HTML tiene los contenedores para los gráficos
        }
    } catch (e) {
        console.error("Error cargando el medallero");
    }
}
loadData();
