// Sistema de Gestión de Mesas - Versión Frontend Puro para Vercel

// Datos locales (simulando base de datos)
let mesas = [
    { id: 1, numero_mesa: 1, capacidad: 4, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Sala principal' },
    { id: 2, numero_mesa: 2, capacidad: 2, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Terraza' },
    { id: 3, numero_mesa: 3, capacidad: 6, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Sala principal' },
    { id: 4, numero_mesa: 4, capacidad: 4, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Sala principal' },
    { id: 5, numero_mesa: 5, capacidad: 2, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Terraza' },
    { id: 6, numero_mesa: 6, capacidad: 8, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Sala VIP' },
    { id: 7, numero_mesa: 7, capacidad: 4, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Sala principal' },
    { id: 8, numero_mesa: 8, capacidad: 3, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Terraza' },
    { id: 9, numero_mesa: 9, capacidad: 4, estado: 'disponible', cliente_nombre: null, cliente_cantidad: null, hora_entrada: null, ubicacion: 'Sala principal' }
];

// Cargar datos desde localStorage si existen
function cargarDatos() {
    const datosGuardados = localStorage.getItem('mesasRestaurante');
    if (datosGuardados) {
        mesas = JSON.parse(datosGuardados);
    }
}

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('mesasRestaurante', JSON.stringify(mesas));
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    renderizarMesas();
    actualizarEstadisticas();
    actualizarSelectMesas();
});

// Renderizar todas las mesas
function renderizarMesas(mesasFiltradas = null) {
    const container = document.getElementById('mesasContainer');
    const mesasAMostrar = mesasFiltradas || mesas;
    
    container.innerHTML = '';
    
    mesasAMostrar.forEach(mesa => {
        const card = crearCardMesa(mesa);
        container.innerHTML += card;
    });
}

// Crear card HTML para una mesa
function crearCardMesa(mesa) {
    const estadoColors = {
        'disponible': 'success',
        'ocupada': 'danger',
        'reservada': 'warning',
        'mantenimiento': 'secondary'
    };
    
    const estadoIcons = {
        'disponible': 'check-circle',
        'ocupada': 'person-fill',
        'reservada': 'calendar-check',
        'mantenimiento': 'tools'
    };
    
    const color = estadoColors[mesa.estado] || 'secondary';
    const icon = estadoIcons[mesa.estado] || 'question-circle';
    
    return `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100 ${mesa.estado === 'disponible' ? 'border-success' : ''}">
                <div class="card-header bg-${color} text-white">
                    <h6 class="mb-0">
                        <i class="bi bi-${icon}"></i> Mesa ${mesa.numero_mesa}
                    </h6>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        <strong>Capacidad:</strong> ${mesa.capacidad} personas<br>
                        <strong>Estado:</strong> <span class="badge bg-${color}">${mesa.estado}</span><br>
                        ${mesa.ubicacion ? `<strong>Ubicación:</strong> ${mesa.ubicacion}<br>` : ''}
                        ${mesa.cliente_nombre ? `<strong>Cliente:</strong> ${mesa.cliente_nombre}<br>` : ''}
                        ${mesa.hora_entrada ? `<strong>Hora:</strong> ${mesa.hora_entrada}` : ''}
                    </p>
                </div>
                <div class="card-footer">
                    <div class="btn-group w-100" role="group">
                        ${mesa.estado === 'disponible' ? 
                            `<button class="btn btn-primary btn-sm" onclick="mostrarModalAsignar(${mesa.id})">
                                <i class="bi bi-person-plus"></i> Asignar
                            </button>` : ''}
                        ${mesa.estado === 'ocupada' ? 
                            `<button class="btn btn-warning btn-sm" onclick="liberarMesa(${mesa.id})">
                                <i class="bi bi-door-open"></i> Liberar
                            </button>` : ''}
                        ${mesa.estado === 'reservada' ? 
                            `<button class="btn btn-success btn-sm" onclick="confirmarReserva(${mesa.id})">
                                <i class="bi bi-check2"></i> Confirmar
                            </button>` : ''}
                        <button class="btn btn-info btn-sm" onclick="mostrarDetallesMesa(${mesa.id})">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const total = mesas.length;
    const disponibles = mesas.filter(m => m.estado === 'disponible').length;
    const ocupadas = mesas.filter(m => m.estado === 'ocupada').length;
    const reservadas = mesas.filter(m => m.estado === 'reservada').length;
    
    document.getElementById('totalMesas').textContent = total;
    document.getElementById('mesasDisponibles').textContent = disponibles;
    document.getElementById('mesasOcupadas').textContent = ocupadas;
    document.getElementById('mesasReservadas').textContent = reservadas;
}

// Filtrar mesas
function filtrarMesas() {
    const estado = document.getElementById('filtroEstado').value;
    const capacidad = document.getElementById('filtroCapacidad').value;
    const busqueda = document.getElementById('busquedaMesa').value.toLowerCase();
    
    let mesasFiltradas = mesas;
    
    if (estado) {
        mesasFiltradas = mesasFiltradas.filter(m => m.estado === estado);
    }
    
    if (capacidad) {
        mesasFiltradas = mesasFiltradas.filter(m => m.capacidad == capacidad);
    }
    
    if (busqueda) {
        mesasFiltradas = mesasFiltradas.filter(m => 
            m.numero_mesa.toString().includes(busqueda) ||
            (m.ubicacion && m.ubicacion.toLowerCase().includes(busqueda))
        );
    }
    
    renderizarMesas(mesasFiltradas);
}

// Mostrar modal para asignar mesa
function mostrarModalAsignar(mesaId) {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    document.getElementById('mesaId').value = mesa.id;
    document.getElementById('mesaNumero').value = mesa.numero_mesa;
    document.getElementById('clienteNombre').value = '';
    document.getElementById('cantidadPersonas').value = '';
    document.getElementById('observaciones').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('modalAsignar'));
    modal.show();
}

// Asignar mesa
function asignarMesa() {
    const mesaId = parseInt(document.getElementById('mesaId').value);
    const clienteNombre = document.getElementById('clienteNombre').value.trim();
    const cantidadPersonas = parseInt(document.getElementById('cantidadPersonas').value);
    const observaciones = document.getElementById('observaciones').value.trim();
    
    if (!clienteNombre || !cantidadPersonas) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    mesa.estado = 'ocupada';
    mesa.cliente_nombre = clienteNombre;
    mesa.cliente_cantidad = cantidadPersonas;
    mesa.hora_entrada = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    mesa.observaciones = observaciones;
    
    guardarDatos();
    renderizarMesas();
    actualizarEstadisticas();
    
    bootstrap.Modal.getInstance(document.getElementById('modalAsignar')).hide();
    mostrarExito('Mesa asignada exitosamente');
}

// Liberar mesa
function liberarMesa(mesaId) {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    mesa.estado = 'disponible';
    mesa.cliente_nombre = null;
    mesa.cliente_cantidad = null;
    mesa.hora_entrada = null;
    mesa.hora_salida = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    mesa.observaciones = null;
    
    guardarDatos();
    renderizarMesas();
    actualizarEstadisticas();
    
    mostrarExito('Mesa liberada exitosamente');
}

// Confirmar reserva
function confirmarReserva(mesaId) {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    mesa.estado = 'ocupada';
    mesa.hora_entrada = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    guardarDatos();
    renderizarMesas();
    actualizarEstadisticas();
    
    mostrarExito('Reserva confirmada exitosamente');
}

// Mostrar detalles de mesa
function mostrarDetallesMesa(mesaId) {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    let detalles = `
        <strong>Mesa:</strong> ${mesa.numero_mesa}<br>
        <strong>Capacidad:</strong> ${mesa.capacidad} personas<br>
        <strong>Estado:</strong> ${mesa.estado}<br>
        <strong>Ubicación:</strong> ${mesa.ubicacion || 'No especificada'}<br>
    `;
    
    if (mesa.cliente_nombre) {
        detalles += `
            <strong>Cliente:</strong> ${mesa.cliente_nombre}<br>
            <strong>Cantidad:</strong> ${mesa.cliente_cantidad} personas<br>
            <strong>Hora entrada:</strong> ${mesa.hora_entrada}<br>
        `;
    }
    
    if (mesa.observaciones) {
        detalles += `<strong>Observaciones:</strong> ${mesa.observaciones}<br>`;
    }
    
    alert(detalles);
}

// Mostrar modal de sugerencia
function mostrarModalSugerencia() {
    document.getElementById('personasSugerencia').value = '';
    document.getElementById('preferenciaSugerencia').value = 'exacta';
    document.getElementById('resultadoSugerencia').innerHTML = '';
    
    const modal = new bootstrap.Modal(document.getElementById('modalSugerencia'));
    modal.show();
}

// Buscar sugerencia de mesa
function buscarSugerencia() {
    const personas = parseInt(document.getElementById('personasSugerencia').value);
    const preferencia = document.getElementById('preferenciaSugerencia').value;
    
    if (!personas) {
        alert('Por favor ingrese el número de personas');
        return;
    }
    
    let mesasDisponibles = mesas.filter(m => m.estado === 'disponible');
    let mesasFiltradas = [];
    
    switch (preferencia) {
        case 'exacta':
            mesasFiltradas = mesasDisponibles.filter(m => m.capacidad == personas);
            break;
        case 'superior':
            mesasFiltradas = mesasDisponibles.filter(m => m.capacidad >= personas);
            break;
        case 'cercana':
            mesasFiltradas = mesasDisponibles.filter(m => m.capacidad >= personas)
                .sort((a, b) => a.capacidad - b.capacidad);
            break;
    }
    
    const resultadoDiv = document.getElementById('resultadoSugerencia');
    
    if (mesasFiltradas.length === 0) {
        resultadoDiv.innerHTML = '<div class="alert alert-warning">No hay mesas disponibles para los criterios seleccionados.</div>';
        return;
    }
    
    let html = '<div class="alert alert-success">Mesas sugeridas:</div>';
    html += '<div class="list-group">';
    
    mesasFiltradas.slice(0, 3).forEach(mesa => {
        html += `
            <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Mesa ${mesa.numero_mesa}</strong> - ${mesa.capacidad} personas
                        ${mesa.ubicacion ? `<br><small>${mesa.ubicacion}</small>` : ''}
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="seleccionarMesaSugerida(${mesa.id})">
                        Seleccionar
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultadoDiv.innerHTML = html;
}

// Seleccionar mesa sugerida
function seleccionarMesaSugerida(mesaId) {
    bootstrap.Modal.getInstance(document.getElementById('modalSugerencia')).hide();
    mostrarModalAsignar(mesaId);
}

// Mostrar modal de reserva
function mostrarModalReserva() {
    document.getElementById('reservaClienteNombre').value = '';
    document.getElementById('reservaCantidadPersonas').value = '';
    document.getElementById('reservaFecha').value = '';
    document.getElementById('reservaHora').value = '';
    document.getElementById('reservaMesaPreferida').value = '';
    
    actualizarSelectMesas();
    
    const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
    modal.show();
}

// Actualizar select de mesas para reserva
function actualizarSelectMesas() {
    const select = document.getElementById('reservaMesaPreferida');
    const mesasDisponibles = mesas.filter(m => m.estado === 'disponible');
    
    select.innerHTML = '<option value="">Sin preferencia</option>';
    mesasDisponibles.forEach(mesa => {
        select.innerHTML += `<option value="${mesa.id}">Mesa ${mesa.numero_mesa} (${mesa.capacidad} personas)</option>`;
    });
}

// Crear reserva
async function crearReserva() {
    const clienteNombre = document.getElementById('reservaClienteNombre').value.trim();
    const cantidadPersonas = parseInt(document.getElementById('reservaCantidadPersonas').value);
    const fecha = document.getElementById('reservaFecha').value;
    const hora = document.getElementById('reservaHora').value;
    const mesaPreferida = document.getElementById('reservaMesaPreferida').value;
    
    if (!clienteNombre || !cantidadPersonas || !fecha || !hora) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    let mesaAsignada;
    
    if (mesaPreferida) {
        mesaAsignada = mesas.find(m => m.id == mesaPreferida && m.estado === 'disponible');
    }
    
    if (!mesaAsignada) {
        mesaAsignada = mesas.find(m => m.estado === 'disponible' && m.capacidad >= cantidadPersonas);
    }
    
    if (!mesaAsignada) {
        alert('No hay mesas disponibles para la reserva');
        return;
    }
    
    try {
        const { error } = await supabase
            .from('mesas')
            .update({
                estado: 'reservada',
                cliente_nombre: clienteNombre,
                cliente_cantidad: cantidadPersonas,
                fecha_reserva: fecha,
                hora_entrada: hora
            })
            .eq('id', mesaAsignada.id);
        
        if (error) throw error;
        
        await cargarMesas();
        bootstrap.Modal.getInstance(document.getElementById('modalReserva')).hide();
        mostrarExito('Reserva creada exitosamente');
    } catch (error) {
        console.error('Error al crear reserva:', error);
        mostrarError('Error al crear la reserva');
    }
}

// Mostrar modal de administración de mesas
function mostrarModalAdminMesas() {
    cargarTablaMesasAdmin();
    const modal = new bootstrap.Modal(document.getElementById('modalAdminMesas'));
    modal.show();
}

// Cargar tabla de administración de mesas
function cargarTablaMesasAdmin() {
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

// Mostrar modal para agregar mesa
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

// Editar mesa
function editarMesa(mesaId) {
    const mesa = mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    
    document.getElementById('tituloMesaForm').textContent = 'Editar Mesa';
    document.getElementById('mesaFormId').value = mesa.id;
    document.getElementById('mesaFormNumero').value = mesa.numero_mesa;
    document.getElementById('mesaFormCapacidad').value = mesa.capacidad;
    document.getElementById('mesaFormEstado').value = mesa.estado;
    document.getElementById('mesaFormUbicacion').value = mesa.ubicacion || '';
    
    bootstrap.Modal.getInstance(document.getElementById('modalAdminMesas')).hide();
    const modal = new bootstrap.Modal(document.getElementById('modalMesaForm'));
    modal.show();
}

// Guardar mesa (agregar o editar)
async function guardarMesa() {
    const mesaId = document.getElementById('mesaFormId').value;
    const numero = parseInt(document.getElementById('mesaFormNumero').value);
    const capacidad = parseInt(document.getElementById('mesaFormCapacidad').value);
    const estado = document.getElementById('mesaFormEstado').value;
    const ubicacion = document.getElementById('mesaFormUbicacion').value.trim();
    
    if (!numero || !capacidad) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Verificar si el número de mesa ya existe
    const existeMesa = mesas.find(m => m.numero_mesa === numero && m.id != mesaId);
    if (existeMesa) {
        alert('El número de mesa ya existe');
        return;
    }
    
    try {
        let error;
        
        if (mesaId) {
            // Editar mesa existente
            const { error: updateError } = await supabase
                .from('mesas')
                .update({
                    numero_mesa: numero,
                    capacidad: capacidad,
                    estado: estado,
                    ubicacion: ubicacion
                })
                .eq('id', mesaId);
            error = updateError;
        } else {
            // Agregar nueva mesa
            const { error: insertError } = await supabase
                .from('mesas')
                .insert({
                    numero_mesa: numero,
                    capacidad: capacidad,
                    estado: estado,
                    ubicacion: ubicacion
                });
            error = insertError;
        }
        
        if (error) throw error;
        
        await cargarMesas();
        bootstrap.Modal.getInstance(document.getElementById('modalMesaForm')).hide();
        mostrarExito(mesaId ? 'Mesa actualizada exitosamente' : 'Mesa agregada exitosamente');
    } catch (error) {
        console.error('Error al guardar mesa:', error);
        mostrarError('Error al guardar la mesa');
    }
}

// Eliminar mesa
async function eliminarMesa(mesaId) {
    if (!confirm('¿Está seguro de que desea eliminar esta mesa? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('mesas')
            .delete()
            .eq('id', mesaId);
        
        if (error) throw error;
        
        await cargarMesas();
        cargarTablaMesasAdmin();
        mostrarExito('Mesa eliminada exitosamente');
    } catch (error) {
        console.error('Error al eliminar mesa:', error);
        mostrarError('Error al eliminar la mesa');
    }
}

// Funciones de utilidad
function mostrarExito(mensaje) {
    // Crear toast de éxito
    const toastHtml = `
        <div class="toast align-items-center text-white bg-success border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${mensaje}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.innerHTML = toastHtml;
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    setTimeout(() => {
        document.body.removeChild(toastContainer);
    }, 5000);
}

function mostrarError(mensaje) {
    // Crear toast de error
    const toastHtml = `
        <div class="toast align-items-center text-white bg-danger border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${mensaje}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.innerHTML = toastHtml;
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    setTimeout(() => {
        document.body.removeChild(toastContainer);
    }, 5000);
}
