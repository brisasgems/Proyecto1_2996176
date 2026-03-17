<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['accion'])) {
    echo json_encode(['success' => false, 'message' => 'Acción no especificada.']);
    exit;
}

$accion = $data['accion'];

try {
    switch ($accion) {
        case 'actualizar':
            if (isset($data['id']) && isset($data['nuevoEstado'])) {
                $id = filter_var($data['id'], FILTER_VALIDATE_INT);
                $estado = htmlspecialchars(strip_tags($data['nuevoEstado']));

                if ($id === false) {
                    echo json_encode(['success' => false, 'message' => 'ID de mesa inválido.']);
                    exit;
                }

                $sql = "UPDATE mesas SET estado = :estado, cliente_nombre = NULL, cliente_cantidad = NULL, hora_entrada = NULL, hora_salida = NULL WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':estado' => $estado, ':id' => $id]);

                echo json_encode(["success" => true, "message" => "Estado actualizado con éxito."]);
            } else {
                echo json_encode(["success" => false, "message" => "Datos incompletos."]);
            }
            break;

        case 'asignar':
            if (isset($data['id']) && isset($data['clienteNombre']) && isset($data['cantidadPersonas'])) {
                $id = filter_var($data['id'], FILTER_VALIDATE_INT);
                $clienteNombre = htmlspecialchars(strip_tags($data['clienteNombre']));
                $cantidadPersonas = filter_var($data['cantidadPersonas'], FILTER_VALIDATE_INT);
                $observaciones = isset($data['observaciones']) ? htmlspecialchars(strip_tags($data['observaciones'])) : null;

                if ($id === false || !$clienteNombre || $cantidadPersonas === false) {
                    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
                    exit;
                }

                $hora_entrada = date('H:i:s');
                $sql = "UPDATE mesas SET estado = 'ocupada', cliente_nombre = :clienteNombre, cliente_cantidad = :cantidadPersonas, hora_entrada = :hora_entrada, observaciones = :observaciones WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':clienteNombre' => $clienteNombre,
                    ':cantidadPersonas' => $cantidadPersonas,
                    ':hora_entrada' => $hora_entrada,
                    ':observaciones' => $observaciones,
                    ':id' => $id
                ]);

                echo json_encode(["success" => true, "message" => "Mesa asignada exitosamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Datos incompletos para asignar mesa."]);
            }
            break;

        case 'sugerir':
            if (isset($data['personas']) && isset($data['preferencia'])) {
                $personas = filter_var($data['personas'], FILTER_VALIDATE_INT);
                $preferencia = htmlspecialchars(strip_tags($data['preferencia']));

                if ($personas === false) {
                    echo json_encode(['success' => false, 'message' => 'Número de personas inválido.']);
                    exit;
                }

                $sql = "SELECT * FROM mesas WHERE estado = 'disponible'";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $mesasDisponibles = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $mesasFiltradas = [];

                foreach ($mesasDisponibles as $mesa) {
                    $capacidad = $mesa['capacidad'];
                    $incluir = false;

                    switch ($preferencia) {
                        case 'exacta':
                            $incluir = ($capacidad == $personas);
                            break;
                        case 'superior':
                            $incluir = ($capacidad >= $personas);
                            break;
                        case 'cercana':
                            $incluir = ($capacidad >= $personas);
                            break;
                    }

                    if ($incluir) {
                        $mesasFiltradas[] = $mesa;
                    }
                }

                if ($preferencia === 'cercana' && count($mesasFiltradas) > 0) {
                    usort($mesasFiltradas, function($a, $b) use ($personas) {
                        $diffA = abs($a['capacidad'] - $personas);
                        $diffB = abs($b['capacidad'] - $personas);
                        return $diffA - $diffB;
                    });
                }

                echo json_encode(["success" => true, "mesas" => $mesasFiltradas]);
            } else {
                echo json_encode(["success" => false, "message" => "Datos incompletos para sugerencia."]);
            }
            break;

        case 'reservar':
            if (isset($data['clienteNombre']) && isset($data['cantidadPersonas']) && isset($data['fecha']) && isset($data['hora'])) {
                $clienteNombre = htmlspecialchars(strip_tags($data['clienteNombre']));
                $cantidadPersonas = filter_var($data['cantidadPersonas'], FILTER_VALIDATE_INT);
                $fecha = htmlspecialchars(strip_tags($data['fecha']));
                $hora = htmlspecialchars(strip_tags($data['hora']));
                $mesaPreferida = isset($data['mesaPreferida']) ? filter_var($data['mesaPreferida'], FILTER_VALIDATE_INT) : null;

                if (!$clienteNombre || $cantidadPersonas === false || !$fecha || !$hora) {
                    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
                    exit;
                }

                if ($mesaPreferida) {
                    $sql = "SELECT * FROM mesas WHERE id = :id AND estado = 'disponible'";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([':id' => $mesaPreferida]);
                    $mesa = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($mesa && $mesa['capacidad'] >= $cantidadPersonas) {
                        $sql = "UPDATE mesas SET estado = 'reservada', cliente_nombre = :clienteNombre, cliente_cantidad = :cantidadPersonas, fecha_reserva = :fecha, hora_entrada = :hora WHERE id = :id";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute([
                            ':clienteNombre' => $clienteNombre,
                            ':cantidadPersonas' => $cantidadPersonas,
                            ':fecha' => $fecha,
                            ':hora' => $hora,
                            ':id' => $mesaPreferida
                        ]);
                        echo json_encode(["success" => true, "message" => "Reserva creada exitosamente."]);
                    } else {
                        $sql = "SELECT * FROM mesas WHERE estado = 'disponible' AND capacidad >= :cantidad ORDER BY capacidad ASC LIMIT 1";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute([':cantidad' => $cantidadPersonas]);
                        $mesaAlternativa = $stmt->fetch(PDO::FETCH_ASSOC);

                        if ($mesaAlternativa) {
                            $sql = "UPDATE mesas SET estado = 'reservada', cliente_nombre = :clienteNombre, cliente_cantidad = :cantidadPersonas, fecha_reserva = :fecha, hora_entrada = :hora WHERE id = :id";
                            $stmt = $pdo->prepare($sql);
                            $stmt->execute([
                                ':clienteNombre' => $clienteNombre,
                                ':cantidadPersonas' => $cantidadPersonas,
                                ':fecha' => $fecha,
                                ':hora' => $hora,
                                ':id' => $mesaAlternativa['id']
                            ]);
                            echo json_encode(["success" => true, "message" => "Reserva creada exitosamente en mesa alternativa."]);
                        } else {
                            echo json_encode(["success" => false, "message" => "No hay mesas disponibles para la reserva."]);
                        }
                    }
                } else {
                    $sql = "SELECT * FROM mesas WHERE estado = 'disponible' AND capacidad >= :cantidad ORDER BY capacidad ASC LIMIT 1";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([':cantidad' => $cantidadPersonas]);
                    $mesa = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($mesa) {
                        $sql = "UPDATE mesas SET estado = 'reservada', cliente_nombre = :clienteNombre, cliente_cantidad = :cantidadPersonas, fecha_reserva = :fecha, hora_entrada = :hora WHERE id = :id";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute([
                            ':clienteNombre' => $clienteNombre,
                            ':cantidadPersonas' => $cantidadPersonas,
                            ':fecha' => $fecha,
                            ':hora' => $hora,
                            ':id' => $mesa['id']
                        ]);
                        echo json_encode(["success" => true, "message" => "Reserva creada exitosamente."]);
                    } else {
                        echo json_encode(["success" => false, "message" => "No hay mesas disponibles para la reserva."]);
                    }
                }
            } else {
                echo json_encode(["success" => false, "message" => "Datos incompletos para reserva."]);
            }
            break;

        case 'detalles':
            if (isset($data['id'])) {
                $id = filter_var($data['id'], FILTER_VALIDATE_INT);

                if ($id === false) {
                    echo json_encode(['success' => false, 'message' => 'ID de mesa inválido.']);
                    exit;
                }

                $sql = "SELECT * FROM mesas WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':id' => $id]);
                $mesa = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($mesa) {
                    echo json_encode(["success" => true, "mesa" => $mesa]);
                } else {
                    echo json_encode(["success" => false, "message" => "Mesa no encontrada."]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "ID no especificado."]);
            }
            break;

        case 'listar':
            $sql = "SELECT * FROM mesas ORDER BY numero_mesa ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "mesas" => $mesas]);
            break;

        case 'agregarMesa':
            if (isset($data['numero_mesa']) && isset($data['capacidad'])) {
                $numeroMesa = filter_var($data['numero_mesa'], FILTER_VALIDATE_INT);
                $capacidad = filter_var($data['capacidad'], FILTER_VALIDATE_INT);
                $estado = isset($data['estado']) ? htmlspecialchars(strip_tags($data['estado'])) : 'disponible';
                $ubicacion = isset($data['ubicacion']) ? htmlspecialchars(strip_tags($data['ubicacion'])) : null;

                if ($numeroMesa === false || $capacidad === false) {
                    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
                    exit;
                }

                // Verificar si el número de mesa ya existe
                $sql = "SELECT id FROM mesas WHERE numero_mesa = :numero_mesa";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':numero_mesa' => $numeroMesa]);
                if ($stmt->fetch()) {
                    echo json_encode(['success' => false, 'message' => 'El número de mesa ya existe.']);
                    exit;
                }

                $sql = "INSERT INTO mesas (numero_mesa, capacidad, estado, ubicacion) VALUES (:numero_mesa, :capacidad, :estado, :ubicacion)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':numero_mesa' => $numeroMesa,
                    ':capacidad' => $capacidad,
                    ':estado' => $estado,
                    ':ubicacion' => $ubicacion
                ]);

                echo json_encode(["success" => true, "message" => "Mesa agregada exitosamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Datos incompletos para agregar mesa."]);
            }
            break;

        case 'actualizarMesa':
            if (isset($data['id']) && isset($data['numero_mesa']) && isset($data['capacidad'])) {
                $id = filter_var($data['id'], FILTER_VALIDATE_INT);
                $numeroMesa = filter_var($data['numero_mesa'], FILTER_VALIDATE_INT);
                $capacidad = filter_var($data['capacidad'], FILTER_VALIDATE_INT);
                $estado = isset($data['estado']) ? htmlspecialchars(strip_tags($data['estado'])) : 'disponible';
                $ubicacion = isset($data['ubicacion']) ? htmlspecialchars(strip_tags($data['ubicacion'])) : null;

                if ($id === false || $numeroMesa === false || $capacidad === false) {
                    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
                    exit;
                }

                // Verificar si el número de mesa ya existe (excluyendo la mesa actual)
                $sql = "SELECT id FROM mesas WHERE numero_mesa = :numero_mesa AND id != :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':numero_mesa' => $numeroMesa, ':id' => $id]);
                if ($stmt->fetch()) {
                    echo json_encode(['success' => false, 'message' => 'El número de mesa ya existe.']);
                    exit;
                }

                $sql = "UPDATE mesas SET numero_mesa = :numero_mesa, capacidad = :capacidad, estado = :estado, ubicacion = :ubicacion WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':numero_mesa' => $numeroMesa,
                    ':capacidad' => $capacidad,
                    ':estado' => $estado,
                    ':ubicacion' => $ubicacion,
                    ':id' => $id
                ]);

                echo json_encode(["success" => true, "message" => "Mesa actualizada exitosamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "Datos incompletos para actualizar mesa."]);
            }
            break;

        case 'eliminarMesa':
            if (isset($data['id'])) {
                $id = filter_var($data['id'], FILTER_VALIDATE_INT);

                if ($id === false) {
                    echo json_encode(['success' => false, 'message' => 'ID de mesa inválido.']);
                    exit;
                }

                // Verificar que la mesa esté disponible
                $sql = "SELECT estado FROM mesas WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':id' => $id]);
                $mesa = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$mesa) {
                    echo json_encode(['success' => false, 'message' => 'Mesa no encontrada.']);
                    exit;
                }

                if ($mesa['estado'] !== 'disponible') {
                    echo json_encode(['success' => false, 'message' => 'Solo se pueden eliminar mesas disponibles.']);
                    exit;
                }

                $sql = "DELETE FROM mesas WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':id' => $id]);

                echo json_encode(["success" => true, "message" => "Mesa eliminada exitosamente."]);
            } else {
                echo json_encode(["success" => false, "message" => "ID no especificado para eliminar."]);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no reconocida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error en la base de datos: " . $e->getMessage()]);
}
?>