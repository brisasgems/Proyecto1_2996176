<?php 
require_once 'backend/conexion.php'; 
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Mesas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-light">

    <nav class="navbar navbar-dark bg-dark shadow-sm mb-5">
        <div class="container">
            <span class="navbar-brand mb-0 h1">Sistema de Mesas v1.0</span>
        </div>
    </nav>

    <div class="container">
        <div class="row g-4">
            <?php
            try {
                $query = $pdo->query("SELECT * FROM mesas ORDER BY numero_mesa ASC");
                
                if ($query->rowCount() == 0) {
                    echo "<div class='col-12'><div class='alert alert-info text-center'>No hay mesas configuradas.</div></div>";
                }

                while ($mesa = $query->fetch()) {
                    // Lógica de presentación
                    $claseColor = 'success'; 
                    $proximoEstado = 'ocupada';
                    $btnTexto = 'Marcar Ocupada';

                    if ($mesa['estado'] == 'ocupada') {
                        $claseColor = 'danger';
                        $proximoEstado = 'disponible';
                        $btnTexto = 'Liberar Mesa';
                    } elseif ($mesa['estado'] == 'reservada') {
                        $claseColor = 'warning';
                        $proximoEstado = 'ocupada';
                        $btnTexto = 'Cliente Llegó';
                    }

                    // Preparamos la función del botón en una variable limpia para evitar errores de sintaxis en el IDE
                    $idSeguro = (int) $mesa['id'];
                    $accionBoton = "actualizarMesa($idSeguro, '$proximoEstado')";
            ?>
            
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 border-<?php echo $claseColor; ?> shadow-sm">
                    <div class="card-header bg-<?php echo $claseColor; ?> text-white text-center fw-bold">
                        Mesa #<?php echo htmlspecialchars($mesa['numero_mesa']); ?>
                    </div>
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title text-uppercase small fw-bold text-muted">Estado actual:</h5>
                        <p class="h4 mb-3"><?php echo ucfirst(htmlspecialchars($mesa['estado'])); ?></p>
                        <p class="card-text text-muted mb-4">Capacidad: <?php echo htmlspecialchars($mesa['capacidad']); ?> personas</p>
                        
                        <button class="btn btn-<?php echo $claseColor; ?> mt-auto w-100" onclick="<?php echo $accionBoton; ?>">
                            <?php echo $btnTexto; ?>
                        </button>
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

    <script src="js/script.js"></script>
</body>
</html>