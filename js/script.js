// Variables globales
let mesasData = [];

// Función para mostrar modal de asignar mesa
function mostrarModalAsignar(mesaId, capacidad, numeroMesa) {
    document.getElementById('mesaId').value = mesaId;
    document.getElementById('mesaNumero').value = numeroMesa;
    document.getElementById('mesaCapacidad').value = capacidad;
    document.getElementById('modalMesaNumero').textContent = numeroMesa;
    document.getElementById('modalMesaCapacidad').textContent = capacidad;
    document.getElementById('cantidadPersonas').max = capacidad;
    document.getElementById('cantidadPersonas').value = '';
    document.getElementById('clienteNombre').value = '';
    document.getElementById('observaciones').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('modalAsignarMesa'));
    modal.show();
}

// Función para asignar mesa
async function asignarMesa() {
    const mesaId = document.getElementById('mesaId').value;
    const clienteNombre = document.getElementById('clienteNombre').value.trim();
    const cantidadPersonas = document.getElementById('cantidadPersonas').value;
    const observaciones = document.getElementById('observaciones').value.trim();
    const capacidad = document.getElementById('mesaCapacidad').value;
    
    // Validaciones
    if (!clienteNombre) {
        alert('Por favor ingrese el nombre del cliente');
        return;
    }
    
    if (!cantidadPersonas || cantidadPersonas < 1) {
        alert('Por favor ingrese un número válido de personas');
        return;
    }
    
    if (parseInt(cantidadPersonas) > parseInt(capacidad)) {
        alert(`El número de personas no puede exceder la capacidad de la mesa (${capacidad} personas)`);
        return;
    }
    
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'asignar',
                id: mesaId,
                clienteNombre: clienteNombre,
                cantidadPersonas: cantidadPersonas,
                observaciones: observaciones
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('modalAsignarMesa')).hide();
            window.location.reload();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al asignar mesa:", error);
        alert("Ocurrió un error al asignar la mesa.");
    }
}

// Función para mostrar modal de sugerencia
function mostrarModalSugerencia() {
    document.getElementById('personasSugerencia').value = '2';
    document.getElementById('preferenciaCapacidad').value = 'superior';
    document.getElementById('resultadosSugerencia').innerHTML = '';
    
    const modal = new bootstrap.Modal(document.getElementById('modalSugerencia'));
    modal.show();
}

// Función para buscar sugerencias de mesas
async function buscarSugerencias() {
    const personas = document.getElementById('personasSugerencia').value;
    const preferencia = document.getElementById('preferenciaCapacidad').value;
    
    if (!personas || personas < 1) {
        alert('Por favor ingrese un número válido de personas');
        return;
    }
    
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'sugerir',
                personas: personas,
                preferencia: preferencia
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            mostrarResultadosSugerencia(data.mesas);
        } else {
            document.getElementById('resultadosSugerencia').innerHTML = 
                '<div class="alert alert-warning">No se encontraron mesas disponibles para ' + personas + ' personas.</div>';
        }
    } catch (error) {
        console.error("Error al buscar sugerencias:", error);
        alert("Ocurrió un error al buscar mesas disponibles.");
    }
}

// Función para mostrar resultados de sugerencia
function mostrarResultadosSugerencia(mesas) {
    const contenedor = document.getElementById('resultadosSugerencia');
    
    if (mesas.length === 0) {
        contenedor.innerHTML = '<div class="alert alert-info">No hay mesas disponibles que coincidan con los criterios.</div>';
        return;
    }
    
    let html = '<h6 class="mb-3">Mesas recomendadas:</h6>';
    html += '<div class="row g-2">';
    
    mesas.forEach(mesa => {
        html += `
            <div class="col-md-6">
                <div class="card border-success">
                    <div class="card-body text-center">
                        <h6 class="card-title">Mesa #${mesa.numero_mesa}</h6>
                        <p class="mb-2">
                            <span class="badge bg-secondary">${mesa.capacidad} personas</span>
                            <span class="badge bg-success">Disponible</span>
                        </p>
                        <button class="btn btn-sm btn-success" onclick="seleccionarMesaSugerida(${mesa.id}, ${mesa.capacidad}, ${mesa.numero_mesa})">
                            <i class="bi bi-check-circle"></i> Seleccionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
}

// Función para seleccionar mesa sugerida
function seleccionarMesaSugerida(mesaId, capacidad, numeroMesa) {
    bootstrap.Modal.getInstance(document.getElementById('modalSugerencia')).hide();
    mostrarModalAsignar(mesaId, capacidad, numeroMesa);
}

// Función para mostrar modal de reserva
function mostrarModalReserva() {
    document.getElementById('reservaClienteNombre').value = '';
    document.getElementById('reservaCantidadPersonas').value = '';
    document.getElementById('reservaFecha').value = '';
    document.getElementById('reservaHora').value = '';
    document.getElementById('reservaMesaPreferida').value = '';
    
    // Establecer fecha por defecto (hoy)
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('reservaFecha').value = hoy;
    
    const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
    modal.show();
}

// Función para crear reserva
async function crearReserva() {
    const clienteNombre = document.getElementById('reservaClienteNombre').value.trim();
    const cantidadPersonas = document.getElementById('reservaCantidadPersonas').value;
    const fecha = document.getElementById('reservaFecha').value;
    const hora = document.getElementById('reservaHora').value;
    const mesaPreferida = document.getElementById('reservaMesaPreferida').value;
    
    // Validaciones
    if (!clienteNombre || !cantidadPersonas || !fecha || !hora) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'reservar',
                clienteNombre: clienteNombre,
                cantidadPersonas: cantidadPersonas,
                fecha: fecha,
                hora: hora,
                mesaPreferida: mesaPreferida
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('modalReserva')).hide();
            alert('Reserva creada exitosamente');
            window.location.reload();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al crear reserva:", error);
        alert("Ocurrió un error al crear la reserva.");
    }
}

// Función para mostrar detalles de mesa
async function mostrarDetallesMesa(mesaId) {
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'detalles',
                id: mesaId
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            mostrarModalDetalles(data.mesa);
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al obtener detalles:", error);
        alert("Ocurrió un error al obtener los detalles de la mesa.");
    }
}

// Función para mostrar modal con detalles
function mostrarModalDetalles(mesa) {
    const contenido = document.getElementById('detallesContenido');
    
    let html = `
        <div class="row">
            <div class="col-12">
                <h5 class="text-center mb-3">Mesa #${mesa.numero_mesa}</h5>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <strong>Estado:</strong><br>
                <span class="badge bg-${mesa.estado === 'disponible' ? 'success' : mesa.estado === 'ocupada' ? 'danger' : 'warning'}">
                    ${mesa.estado.toUpperCase()}
                </span>
            </div>
            <div class="col-6">
                <strong>Capacidad:</strong><br>
                ${mesa.capacidad} personas
            </div>
        </div>
    `;
    
    if (mesa.cliente_nombre) {
        html += `
            <div class="row mt-3">
                <div class="col-6">
                    <strong>Cliente:</strong><br>
                    ${mesa.cliente_nombre}
                </div>
                <div class="col-6">
                    <strong>Personas:</strong><br>
                    ${mesa.cliente_cantidad || 'N/A'}
                </div>
            </div>
        `;
    }
    
    if (mesa.hora_entrada) {
        html += `
            <div class="row mt-3">
                <div class="col-6">
                    <strong>Hora entrada:</strong><br>
                    ${mesa.hora_entrada}
                </div>
                <div class="col-6">
                    <strong>Hora salida:</strong><br>
                    ${mesa.hora_salida || 'En curso'}
                </div>
            </div>
        `;
    }
    
    if (mesa.fecha_reserva) {
        html += `
            <div class="row mt-3">
                <div class="col-12">
                    <strong>Fecha reserva:</strong><br>
                    ${mesa.fecha_reserva}
                </div>
            </div>
        `;
    }
    
    if (mesa.observaciones) {
        html += `
            <div class="row mt-3">
                <div class="col-12">
                    <strong>Observaciones:</strong><br>
                    <small>${mesa.observaciones}</small>
                </div>
            </div>
        `;
    }
    
    contenido.innerHTML = html;
    const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
    modal.show();
}

// Función para filtrar mesas
function filtrarMesas() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroCapacidad = document.getElementById('filtroCapacidad').value;
    const busqueda = document.getElementById('busquedaMesa').value.toLowerCase();
    
    const mesas = document.querySelectorAll('.mesa-card');
    
    mesas.forEach(mesa => {
        const estado = mesa.dataset.estado;
        const capacidad = mesa.dataset.capacidad;
        const numero = mesa.dataset.numero;
        
        let mostrar = true;
        
        // Filtrar por estado
        if (filtroEstado && estado !== filtroEstado) {
            mostrar = false;
        }
        
        // Filtrar por capacidad
        if (filtroCapacidad && capacidad !== filtroCapacidad) {
            mostrar = false;
        }
        
        // Filtrar por número de mesa
        if (busqueda && !numero.includes(busqueda)) {
            mostrar = false;
        }
        
        mesa.style.display = mostrar ? 'block' : 'none';
    });
}

// Función existente mejorada
async function actualizarMesa(id, nuevoEstado) {
    // Deshabilitar el botón temporalmente para evitar doble clic
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'actualizar',
                id: id,
                nuevoEstado: nuevoEstado
            })
        });

        // Verificamos que el servidor respondió con un código 200 OK
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }

        const data = await respuesta.json();

        if (data.success) {
            // Recargamos la página para que PHP pinte los nuevos colores
            window.location.reload();
        } else {
            alert("Atención: " + data.message);
        }
    } catch (error) {
        console.error("Error en la petición Fetch:", error);
        alert("Ocurrió un error al comunicarse con el servidor.");
    }
}

// Función para mostrar modal de administración de mesas
function mostrarModalAdminMesas() {
    cargarTablaMesasAdmin();
    const modal = new bootstrap.Modal(document.getElementById('modalAdminMesas'));
    modal.show();
}

// Función para cargar tabla de administración de mesas
async function cargarTablaMesasAdmin() {
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'listar'
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            mostrarTablaMesasAdmin(data.mesas);
        } else {
            console.error("Error al cargar mesas:", data.message);
        }
    } catch (error) {
        console.error("Error al cargar mesas:", error);
    }
}

// Función para mostrar tabla de administración
function mostrarTablaMesasAdmin(mesas) {
    const tbody = document.getElementById('tablaMesasAdmin');
    let html = '';
    
    mesas.forEach(mesa => {
        const estadoClass = mesa.estado === 'disponible' ? 'success' : 
                          mesa.estado === 'ocupada' ? 'danger' : 
                          mesa.estado === 'reservada' ? 'warning' : 'secondary';
        
        html += `
            <tr>
                <td><strong>${mesa.numero_mesa}</strong></td>
                <td>${mesa.capacidad} personas</td>
                <td><span class="badge bg-${estadoClass}">${mesa.estado}</span></td>
                <td>${mesa.cliente_nombre || '-'}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-primary" onclick="editarMesa(${mesa.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        ${mesa.estado === 'disponible' ? 
                            `<button class="btn btn-outline-danger" onclick="eliminarMesa(${mesa.id})" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// Función para mostrar modal de agregar mesa
function mostrarModalAgregarMesa() {
    document.getElementById('tituloMesaForm').textContent = 'Agregar Nueva Mesa';
    document.getElementById('mesaFormId').value = '';
    document.getElementById('mesaFormNumero').value = '';
    document.getElementById('mesaFormCapacidad').value = '';
    document.getElementById('mesaFormEstado').value = 'disponible';
    document.getElementById('mesaFormUbicacion').value = '';
    
    bootstrap.Modal.getInstance(document.getElementById('modalAdminMesas')).hide();
    const modal = new bootstrap.Modal(document.getElementById('modalMesaForm'));
    modal.show();
}

// Función para editar mesa
async function editarMesa(mesaId) {
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'detalles',
                id: mesaId
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            const mesa = data.mesa;
            document.getElementById('tituloMesaForm').textContent = 'Editar Mesa';
            document.getElementById('mesaFormId').value = mesa.id;
            document.getElementById('mesaFormNumero').value = mesa.numero_mesa;
            document.getElementById('mesaFormCapacidad').value = mesa.capacidad;
            document.getElementById('mesaFormEstado').value = mesa.estado;
            document.getElementById('mesaFormUbicacion').value = mesa.ubicacion || '';
            
            bootstrap.Modal.getInstance(document.getElementById('modalAdminMesas')).hide();
            const modal = new bootstrap.Modal(document.getElementById('modalMesaForm'));
            modal.show();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al cargar detalles de mesa:", error);
        alert("Ocurrió un error al cargar los detalles de la mesa.");
    }
}

// Función para guardar mesa
async function guardarMesa() {
    const mesaId = document.getElementById('mesaFormId').value;
    const numero = document.getElementById('mesaFormNumero').value;
    const capacidad = document.getElementById('mesaFormCapacidad').value;
    const estado = document.getElementById('mesaFormEstado').value;
    const ubicacion = document.getElementById('mesaFormUbicacion').value;
    
    // Validaciones
    if (!numero || !capacidad) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    try {
        const accion = mesaId ? 'actualizarMesa' : 'agregarMesa';
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: accion,
                id: mesaId || null,
                numero_mesa: numero,
                capacidad: capacidad,
                estado: estado,
                ubicacion: ubicacion
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('modalMesaForm')).hide();
            alert(mesaId ? 'Mesa actualizada exitosamente' : 'Mesa agregada exitosamente');
            window.location.reload();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al guardar mesa:", error);
        alert("Ocurrió un error al guardar la mesa.");
    }
}

// Función para eliminar mesa
async function eliminarMesa(mesaId) {
    if (!confirm('¿Está seguro de que desea eliminar esta mesa? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const respuesta = await fetch('backend/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                accion: 'eliminarMesa',
                id: mesaId
            })
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error de red: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        if (data.success) {
            alert('Mesa eliminada exitosamente');
            cargarTablaMesasAdmin();
            window.location.reload();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error("Error al eliminar mesa:", error);
        alert("Ocurrió un error al eliminar la mesa.");
    }
}