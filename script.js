const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const tables = doc.querySelectorAll('table');
        
        console.log("Conexión con Excel: OK");
        // Aquí el código ya puede ver todas las pestañas porque publicaste el documento completo
    } catch (error) {
        console.error("Error al leer el Excel:", error);
    }
}

loadData();
