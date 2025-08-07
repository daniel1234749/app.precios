document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tabla-productos");
    const inputBuscar = document.getElementById("input-buscar");
    const noResultsDiv = document.getElementById('noResults');

    let productosCargados = [];

    // Función para mostrar los productos en la tabla
    const mostrarProductos = (productos) => {
        if (!tabla) {
            console.error("Error: El elemento con ID 'tabla-productos' no se encontró en el DOM.");
            return;
        }
        const tbody = tabla.querySelector('tbody');
        if (!tbody) {
            console.error("Error: El elemento <tbody> no se encontró dentro de la tabla.");
            return;
        }
        tbody.innerHTML = ""; // Limpiar el tbody

        if (productos.length === 0) {
            noResultsDiv.classList.remove('hidden');
            return;
        }
        noResultsDiv.classList.add('hidden');

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            // Convertir el precio a número y reemplazar la coma por punto si es necesario
            // Acceder a 'Precio' con 'P' mayúscula
            const precioNumerico = parseFloat(String(producto.Precio).replace(',', '.'));

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>$${precioNumerico.toFixed(2)}</td>
            `;

            tbody.appendChild(fila);
        });
    };

    // Buscar productos por código o descripción
    const filtrarProductos = (termino) => {
        const filtro = termino.toLowerCase();

        const resultados = productosCargados.filter(p =>
            String(p.id).includes(filtro) ||
            p.nombre.toLowerCase().includes(filtro)
        );

        mostrarProductos(resultados);
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
            productosCargados = data;
            mostrarProductos(productosCargados);
        })
        .catch(err => {
            console.error("Error al cargar productos.json", err);
            if (noResultsDiv) {
                noResultsDiv.classList.remove('hidden');
                noResultsDiv.textContent = 'Error al cargar la lista de precios. Por favor, inténtalo de nuevo más tarde.';
            }
        });

    // Evento de búsqueda en tiempo real
    if (inputBuscar) {
        inputBuscar.addEventListener("input", (e) => {
            filtrarProductos(e.target.value);
        });
    } else {
        console.error("Error: El elemento con ID 'input-buscar' no se encontró en el DOM.");
    }
});
