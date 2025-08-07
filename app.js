document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tabla-productos");
    const inputBuscar = document.getElementById("input-buscar");
    const noResultsDiv = document.getElementById('noResults');

    let productosCargados = [];

    // Función para mostrar productos de forma rápida usando innerHTML en bloque
    const mostrarProductos = (productos) => {
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = productos.map(producto => {
            const precioNumerico = parseFloat(String(producto.Precio).replace(',', '.'));
            return `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>$${precioNumerico.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        // Mostrar/ocultar mensaje de "sin resultados"
        noResultsDiv.classList.toggle('hidden', productos.length > 0);
    };

    // Función para filtrar productos
    const filtrarProductos = (termino) => {
        const filtro = termino.toLowerCase();

        const resultados = productosCargados.filter(p =>
            p.idStr.includes(filtro) ||
            p.nombreLower.includes(filtro)
        );

        mostrarProductos(resultados);
    };

    // Función debounce para optimizar el buscador
    const debounce = (fn, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    };

    // Cargar JSON al iniciar
    fetch('./data/productos.json')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        })
        .then(data => {
            // Preprocesar datos para búsquedas rápidas
            productosCargados = data.map(p => ({
                ...p,
                idStr: String(p.id),
                nombreLower: p.nombre.toLowerCase()
            }));
            mostrarProductos(productosCargados);
        })
        .catch(err => {
            console.error("Error al cargar productos.json", err);
            noResultsDiv.classList.remove('hidden');
            noResultsDiv.textContent = 'Error al cargar la lista de precios. Por favor, inténtalo de nuevo más tarde.';
        });

    // Evento de búsqueda con debounce
    if (inputBuscar) {
        inputBuscar.addEventListener("input", debounce((e) => {
            filtrarProductos(e.target.value);
        }, 200)); // 200 ms de espera
    } else {
        console.error("Error: El elemento con ID 'input-buscar' no se encontró en el DOM.");
    }
});
