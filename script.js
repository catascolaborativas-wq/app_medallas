const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    const response = await fetch(sheetURL);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const tables = doc.querySelectorAll('table');
    
    // Aquí el código ya lee tus pestañas de Medallas y Certámenes
    console.log("Datos cargados: Medallero listo.");
    // ... (aquí va la lógica de los gráficos que ya tienes en tu versión final)
}
loadData();
