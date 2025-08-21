document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tabla-productos");
    const inputBuscar = document.getElementById("input-buscar");
    const btnBuscar = document.getElementById("btn-buscar");
    const noResultsDiv = document.getElementById('noResults');

    let productosCargados = [];

    const mostrarProductos = (productos) => {
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = productos.map(producto => {
           const precioNumerico = parseFloat(String(producto.precio).replace(',', '.'));

            return `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>$${precioNumerico.toFixed(2)}</td>
                </tr>
            `;
        }).join('');
        noResultsDiv.classList.toggle('hidden', productos.length > 0);
    };

    const filtrarProductos = (termino) => {
        const filtro = termino.trim().toLowerCase();
        const resultados = productosCargados.filter(p =>
            p.idStr.includes(filtro) ||
            p.nombreLower.includes(filtro)
        );
        mostrarProductos(resultados);
    };

    fetch('./data/productos.json')
        .then(res => {
            if (!res.ok) throw new Error('Error ' + res.statusText);
            return res.json();
        })
        .then(data => {
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
            noResultsDiv.textContent = 'Error al cargar la lista de precios. Intenta más tarde.';
        });

    // Evento: Enter en input
    inputBuscar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            filtrarProductos(inputBuscar.value);
        }
    });

    // Evento: clic en botón Buscar
    btnBuscar.addEventListener("click", () => {
        filtrarProductos(inputBuscar.value);
    });
});
