import { Anuncio_Auto } from "./Anuncio.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const eliminarBtn = document.getElementById('btnDelete');
    const spinner = document.getElementById('spinner');
    const autosTable = document.getElementById('tabla');
    const filtroTransaccion = document.getElementById('selectFiltros');
    const promedioPrecio = document.getElementById('filtroPrecio');
    const columnasMostrar = document.querySelectorAll('.form-check-input');
    let autos = [];

    const mostrarSpinner = () => spinner.style.display = 'block';
    const ocultarSpinner = () => spinner.style.display = 'none';

    const cargarAutos = (filtrar = false) => {
        mostrarSpinner();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/autos', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                autos = JSON.parse(xhr.responseText);
                actualizarTabla(filtrar);
                ocultarSpinner();
            }
        };
        xhr.send();
    };

    const actualizarTabla = (filtrar) => {
        autosTable.innerHTML = '';
        let autosFiltrados = autos;

        if (filtrar) {
            const transaccion = filtroTransaccion.value;
            if (transaccion !== 'N/A') {
                autosFiltrados = autos.filter(auto => auto.transaccion === transaccion);
                const precios = autosFiltrados.map(auto => parseFloat(auto.precio));
                const promedio = precios.length ? (precios.reduce((a, b) => a + b, 0) / precios.length).toFixed(2) : "N/A";
                promedioPrecio.value = promedio !== "N/A" ? `$${promedio}` : promedio;
            } else {
                promedioPrecio.value = "N/A";
            }
        } else {
            promedioPrecio.value = "N/A";
        }

        autosFiltrados.forEach(auto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="col-titulo">${auto.titulo}</td>
                <td class="col-transaccion">${auto.transaccion}</td>
                <td class="col-descripcion">${auto.descripcion}</td>
                <td class="col-precio">${auto.precio}</td>
                <td class="col-puertas">${auto.puertas}</td>
                <td class="col-kms">${auto.kms}</td>
                <td class="col-potencia">${auto.potencia}</td>
                <td class="col-acciones">
                    <button class="btn btn-danger eliminar-btn" data-id="${auto.id}">Eliminar</button>
                    <button class="btn btn-warning editar-btn" data-id="${auto.id}">Editar</button>
                </td>
            `;
            autosTable.appendChild(row);
        });

        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                eliminarAuto(id);
            });
        });

        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                cargarAutoEnFormulario(id);
            });
        });

        actualizarVisibilidadColumnas();
    };

    const guardarAuto = () => {
        mostrarSpinner();
        const auto = new Anuncio_Auto(
            form.txtId.value,
            form.titulo.value,
            form.transaccion.value,
            form.descripcion.value,
            form.precio.value,
            form.puertas.value,
            form.kms.value,
            form.potencia.value
        );

        const id = form.txtId.value;
        const xhr = new XMLHttpRequest();
        xhr.open(id ? 'PUT' : 'POST', `http://localhost:3000/autos${id ? '/' + id : ''}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function() {
            if (xhr.status === 201 || xhr.status === 200) {
                cargarAutos(filtroTransaccion.value !== 'N/A');
                form.reset();
                ocultarSpinner();
            }
        };
        xhr.send(JSON.stringify(auto));
    };

    const eliminarAuto = (id) => {
        mostrarSpinner();
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:3000/autos/${id}`, true);
        xhr.onload = function() {
            if (xhr.status === 204) {
                cargarAutos(filtroTransaccion.value !== 'N/A');
                ocultarSpinner();
            }
        };
        xhr.send();
    };

    const cargarAutoEnFormulario = (id) => {
        const auto = autos.find(auto => auto.id === parseInt(id));
        if (auto) {
            form.titulo.value = auto.titulo;
            form.transaccion.value = auto.transaccion;
            form.descripcion.value = auto.descripcion;
            form.precio.value = auto.precio;
            form.puertas.value = auto.puertas;
            form.kms.value = auto.kms;
            form.potencia.value = auto.potencia;
            form.txtId.value = auto.id;
        }
    };

    const actualizarVisibilidadColumnas = () => {
        columnasMostrar.forEach(columna => {
            const colName = columna.value;
            const isChecked = columna.checked;
            const cells = document.querySelectorAll(`.col-${colName}`);
            cells.forEach(cell => {
                cell.style.display = isChecked ? '' : 'none';
            });
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarAuto();
    });

    eliminarBtn.addEventListener('click', () => {
        const id = form.txtId.value;
        if (id) {
            eliminarAuto(id);
        }
    });

    filtroTransaccion.addEventListener('change', () => cargarAutos(true));
    columnasMostrar.forEach(columna => {
        columna.addEventListener('change', actualizarVisibilidadColumnas);
    });

    cargarAutos();
});
