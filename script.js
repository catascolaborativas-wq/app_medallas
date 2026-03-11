/* translate=no */
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        console.log("Sistema funcionando");
    } catch (e) {
        console.log("Error de conexion");
    }
}
loadData();
