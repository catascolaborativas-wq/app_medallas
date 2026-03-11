const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvWqW17KrYyboub3kk01xW1XDr77apCSXw9EJE7y1GFG47Jod727GJT9KKYSn04_BNnZ7KOvt1JkbM/pubhtml";

async function loadData() {
    try {
        const r = await fetch(sheetURL);
        const t = await r.text();
        const p = new DOMParser();
        const d = p.parseFromString(t, 'text/html');
        console.log("Success");
    } catch (e) {
        console.log("Error");
    }
}
loadData();
