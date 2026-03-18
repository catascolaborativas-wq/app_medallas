// Configuración con tus IDs de Google Drive actualizados
const EXCEL_ID = '10OZi0vziwSlAlsm52GjvZbv5rbUP7qIWO6doExDrJqU'; // ID de BBDD_Medallero_Chile
const IMG_PENDIENTE = '10-XEs6lCfGI8S1YK_IR51yKjhRNZG4nO'; // ID de la imagen Pendiente

async function cargarMedallero() {
    const url = `https://docs.google.com/spreadsheets/d/${EXCEL_ID}/export?format=csv&gid=0`;
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.text();
        const filas = data.split('\n').slice(1);
        
        const contenedor = document.getElementById('grid-medallas');
        contenedor.innerHTML = '';

        let certamenesVistos = new Set();

        filas.forEach(fila => {
            const columnas = fila.split(',');
            const nombreCertamen = columnas[0]?.trim(); // Nombre en Columna A
            const linkResultado = columnas[8]?.trim();  // URL en Columna I

            if (nombreCertamen && !certamenesVistos.has(nombreCertamen)) {
                certamenesVistos.add(nombreCertamen);
                
                const box = document.createElement('div');
                box.className = 'recuadro-logo';
                // Por ahora usa Pendiente, pero buscará por nombre en la carpeta 02
                box.innerHTML = `
                    <a href="${linkResultado || '#'}" target="_blank">
                        <img src="https://drive.google.com/thumbnail?id=${IMG_PENDIENTE}&sz=w200" 
                             class="img-certamen" alt="${nombreCertamen}">
                    </a>`;
                contenedor.appendChild(box);
            }
        });
    } catch (e) {
        console.error("Error cargando datos", e);
    }
}

window.onload = cargarMedallero;