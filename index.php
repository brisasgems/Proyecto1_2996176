<?php 
require_once 'backend/conexion.php'; 
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Mesas - Restaurante</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-light">

    <nav class="navbar navbar-dark bg-dark shadow-sm mb-4">
        <div class="container">
            <span class="navbar-brand mb-0 h1">
                <i class="bi bi-shop"></i> Sistema de Mesas v2.0
            </span>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-light btn-sm" onclick="mostrarModalReserva()">
                    <i class="bi bi-calendar-plus"></i> Nueva Reserva
                </button>
                <button class="btn btn-outline-light btn-sm" onclick="mostrarModalSugerencia()">
                    <i class="bi bi-magic"></i> Sugerir Mesa
                </button>
                <button class="btn btn-outline-light btn-sm" onclick="mostrarModalAdminMesas()">
                    <i class="bi bi-gear"></i> Administrar Mesas
                </button>
            </div>
        </div>
    </nav>

    <div class="container">
        <!-- Panel de estadísticas -->
        <div class="row mb-4">
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card bg-success text-white">
                    <div class="card-body text-center">
                        <h5 class="card-title">Disponibles</h5>
                        <h2 id="contador-disponibles">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card bg-danger text-white">
                    <div class="card-body text-center">
                        <h5 class="card-title">Ocupadas</h5>
                        <h2 id="contador-ocupadas">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card bg-warning text-white">
                    <div class="card-body text-center">
                        <h5 class="card-title">Reservadas</h5>
                        <h2 id="contador-reservadas">0</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="card bg-info text-white">
                    <div class="card-body text-center">
                        <h5 class="card-title">Total Mesas</h5>
                        <h2 id="contador-total">0</h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <label class="form-label">Filtrar por estado:</label>
                                <select class="form-select" id="filtroEstado" onchange="filtrarMesas()">
                                    <option value="">Todos los estados</option>
                                    <option value="disponible">Disponibles</option>
                                    <option value="ocupada">Ocupadas</option>
                                    <option value="reservada">Reservadas</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Filtrar por capacidad:</label>
                                <select class="form-select" id="filtroCapacidad" onchange="filtrarMesas()">
                                    <option value="">Todas las capacidades</option>
                                    <option value="2">2 personas</option>
                                    <option value="3">3 personas</option>
                                    <option value="4">4 personas</option>
                                    <option value="6">6 personas</option>
                                    <option value="8">8 personas</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Buscar:</label>
                                <input type="text" class="form-control" id="busquedaMesa" placeholder="Número de mesa..." onkeyup="filtrarMesas()">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Grid de mesas -->
        <div class="row g-4" id="mesasContainer">
            <?php
            $contador = ['disponible' => 0, 'ocupada' => 0, 'reservada' => 0, 'total' => 0];
            
            try {
                $query = $pdo->query("SELECT * FROM mesas ORDER BY numero_mesa ASC");
                
                if ($query->rowCount() == 0) {
                    echo "<div class='col-12'><div class='alert alert-info text-center'>No hay mesas configuradas.</div></div>";
                }

                while ($mesa = $query->fetch()) {
                    $contador['total']++;
                    $contador[$mesa['estado']]++;
                    
                    // Lógica de presentación
                    $claseColor = 'success'; 
                    $iconoEstado = 'bi-check-circle';
                    $proximoEstado = 'ocupada';
                    $btnTexto = 'Asignar Mesa';
                    $btnClase = 'btn-success';

                    if ($mesa['estado'] == 'ocupada') {
                        $claseColor = 'danger';
                        $iconoEstado = 'bi-person-fill';
                        $proximoEstado = 'disponible';
                        $btnTexto = 'Liberar Mesa';
                        $btnClase = 'btn-danger';
                    } elseif ($mesa['estado'] == 'reservada') {
                        $claseColor = 'warning';
                        $iconoEstado = 'bi-calendar-check';
                        $proximoEstado = 'ocupada';
                        $btnTexto = 'Cliente Llegó';
                        $btnClase = 'btn-warning';
                    }

                    $idSeguro = (int) $mesa['id'];
                    $numeroMesa = (int) $mesa['numero_mesa'];
                    $capacidad = (int) $mesa['capacidad'];
                    $estadoActual = htmlspecialchars($mesa['estado']);
            ?>
            
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mesa-card" data-estado="<?php echo $estadoActual; ?>" data-capacidad="<?php echo $capacidad; ?>" data-numero="<?php echo $numeroMesa; ?>">
                <div class="card h-100 border-<?php echo $claseColor; ?> shadow-sm mesa-tarjeta" data-id="<?php echo $idSeguro; ?>">
                    <div class="card-header bg-<?php echo $claseColor; ?> text-white text-center fw-bold">
                        <i class="bi bi-table"></i> Mesa #<?php echo $numeroMesa; ?>
                    </div>
                    <div class="card-body text-center d-flex flex-column">
                        <div class="mb-3">
                            <i class="bi <?php echo $iconoEstado; ?> text-<?php echo $claseColor; ?> fs-3"></i>
                        </div>
                        <h5 class="card-title text-uppercase small fw-bold text-muted">Estado:</h5>
                        <p class="h4 mb-2"><?php echo ucfirst($estadoActual); ?></p>
                        
                        <div class="mb-3">
                            <span class="badge bg-secondary">
                                <i class="bi bi-people"></i> <?php echo $capacidad; ?> personas
                            </span>
                        </div>
                        
                        <?php if (!empty($mesa['cliente_nombre'])): ?>
                        <div class="mb-2">
                            <small class="text-muted">
                                <i class="bi bi-person"></i> <?php echo htmlspecialchars($mesa['cliente_nombre']); ?>
                            </small>
                        </div>
                        <?php endif; ?>
                        
                        <?php if (!empty($mesa['hora_entrada'])): ?>
                        <div class="mb-2">
                            <small class="text-muted">
                                <i class="bi bi-clock"></i> <?php echo htmlspecialchars($mesa['hora_entrada']); ?>
                            </small>
                        </div>
                        <?php endif; ?>
                        
                        <div class="btn-group mt-auto w-100" role="group">
                            <?php if ($mesa['estado'] == 'disponible'): ?>
                                <button class="btn <?php echo $btnClase; ?>" onclick="mostrarModalAsignar(<?php echo $idSeguro; ?>, <?php echo $capacidad; ?>, <?php echo $numeroMesa; ?>)">
                                    <i class="bi bi-plus-circle"></i> <?php echo $btnTexto; ?>
                                </button>
                            <?php else: ?>
                                <button class="btn <?php echo $btnClase; ?>" onclick="actualizarMesa(<?php echo $idSeguro; ?>, '<?php echo $proximoEstado; ?>')">
                                    <i class="bi bi-arrow-repeat"></i> <?php echo $btnTexto; ?>
                                </button>
                            <?php endif; ?>
                            
                            <button class="btn btn-outline-secondary" onclick="mostrarDetallesMesa(<?php echo $idSeguro; ?>)">
                                <i class="bi bi-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <?php 
                } 
            } catch (PDOException $e) {
                echo "<div class='col-12'><div class='alert alert-danger'>Error al cargar las mesas. Revisa la conexión.</div></div>";
            }
            ?>
        </div>
    </div>

    <!-- Modal para asignar mesa -->
    <div class="modal fade" id="modalAsignarMesa" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Asignar Mesa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formAsignarMesa">
                        <input type="hidden" id="mesaId">
                        <input type="hidden" id="mesaNumero">
                        <input type="hidden" id="mesaCapacidad">
                        
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle"></i> 
                            <strong>Mesa #<span id="modalMesaNumero"></span></strong> - 
                            Capacidad: <span id="modalMesaCapacidad"></span> personas
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Nombre del cliente *</label>
                            <input type="text" class="form-control" id="clienteNombre" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Número de personas *</label>
                            <input type="number" class="form-control" id="cantidadPersonas" min="1" required>
                            <div class="form-text">Debe ser menor o igual a la capacidad de la mesa</div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Observaciones</label>
                            <textarea class="form-control" id="observaciones" rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" onclick="asignarMesa()">
                        <i class="bi bi-check-circle"></i> Asignar Mesa
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para sugerir mesa -->
    <div class="modal fade" id="modalSugerencia" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Sugerencia Automática de Mesa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">¿Cuántas personas son?</label>
                        <input type="number" class="form-control" id="personasSugerencia" min="1" value="2">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Preferencia de capacidad:</label>
                        <select class="form-select" id="preferenciaCapacidad">
                            <option value="exacta">Capacidad exacta</option>
                            <option value="superior">Capacidad superior o igual</option>
                            <option value="cercana">Capacidad más cercana</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primary w-100" onclick="buscarSugerencias()">
                        <i class="bi bi-search"></i> Buscar Mesas Disponibles
                    </button>
                    
                    <div id="resultadosSugerencia" class="mt-3"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para nueva reserva -->
    <div class="modal fade" id="modalReserva" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nueva Reserva</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formReserva">
                        <div class="mb-3">
                            <label class="form-label">Nombre del cliente *</label>
                            <input type="text" class="form-control" id="reservaClienteNombre" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Número de personas *</label>
                            <input type="number" class="form-control" id="reservaCantidadPersonas" min="1" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Fecha de reserva *</label>
                            <input type="date" class="form-control" id="reservaFecha" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Hora de reserva *</label>
                            <input type="time" class="form-control" id="reservaHora" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Mesa preferida</label>
                            <select class="form-select" id="reservaMesaPreferida">
                                <option value="">Sin preferencia</option>
                                <?php
                                try {
                                    $mesasQuery = $pdo->query("SELECT id, numero_mesa, capacidad FROM mesas ORDER BY numero_mesa ASC");
                                    while ($mesa = $mesasQuery->fetch()) {
                                        echo "<option value='{$mesa['id']}'>Mesa {$mesa['numero_mesa']} ({$mesa['capacidad']} personas)</option>";
                                    }
                                } catch (PDOException $e) {
                                    // Error handling
                                }
                                ?>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-warning" onclick="crearReserva()">
                        <i class="bi bi-calendar-plus"></i> Crear Reserva
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal detalles de mesa -->
    <div class="modal fade" id="modalDetalles" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalles de Mesa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="detallesContenido">
                    <!-- Contenido dinámico -->
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para administrar mesas -->
    <div class="modal fade" id="modalAdminMesas" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Administrar Mesas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6>Lista de Mesas</h6>
                        <button class="btn btn-primary btn-sm" onclick="mostrarModalAgregarMesa()">
                            <i class="bi bi-plus-circle"></i> Agregar Mesa
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Capacidad</th>
                                    <th>Estado</th>
                                    <th>Cliente</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaMesasAdmin">
                                <!-- Contenido dinámico -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para agregar/editar mesa -->
    <div class="modal fade" id="modalMesaForm" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="tituloMesaForm">Agregar Nueva Mesa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formMesa">
                        <input type="hidden" id="mesaFormId">
                        
                        <div class="mb-3">
                            <label class="form-label">Número de mesa *</label>
                            <input type="number" class="form-control" id="mesaFormNumero" min="1" required>
                            <div class="form-text">Número único identificador de la mesa</div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Capacidad de personas *</label>
                            <select class="form-select" id="mesaFormCapacidad" required>
                                <option value="">Seleccionar capacidad</option>
                                <option value="1">1 persona</option>
                                <option value="2">2 personas</option>
                                <option value="3">3 personas</option>
                                <option value="4">4 personas</option>
                                <option value="5">5 personas</option>
                                <option value="6">6 personas</option>
                                <option value="8">8 personas</option>
                                <option value="10">10 personas</option>
                                <option value="12">12 personas</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Estado inicial</label>
                            <select class="form-select" id="mesaFormEstado">
                                <option value="disponible">Disponible</option>
                                <option value="mantenimiento">En mantenimiento</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Ubicación (opcional)</label>
                            <input type="text" class="form-control" id="mesaFormUbicacion" placeholder="Ej: Terraza, Sala principal, etc.">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarMesa()">
                        <i class="bi bi-save"></i> Guardar Mesa
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    
    <script>
        // Actualizar contadores al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            actualizarContadores();
        });
        
        function actualizarContadores() {
            document.getElementById('contador-disponibles').textContent = '<?php echo $contador['disponible']; ?>';
            document.getElementById('contador-ocupadas').textContent = '<?php echo $contador['ocupada']; ?>';
            document.getElementById('contador-reservadas').textContent = '<?php echo $contador['reservada']; ?>';
            document.getElementById('contador-total').textContent = '<?php echo $contador['total']; ?>';
        }
    </script>
</body>
</html>