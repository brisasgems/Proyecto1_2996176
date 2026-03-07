<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

// Validar que solo acepte peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['id']) && isset($data['nuevoEstado'])) {
    // Sanitización básica (Mejor práctica)
    $id = filter_var($data['id'], FILTER_VALIDATE_INT);
    $estado = htmlspecialchars(strip_tags($data['nuevoEstado']));

    if ($id === false) {
        echo json_encode(['success' => false, 'message' => 'ID de mesa inválido.']);
        exit;
    }

    try {
        // Sentencia preparada para evitar SQL Injection
        $sql = "UPDATE mesas SET estado = :estado WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':estado' => $estado, ':id' => $id]);

        echo json_encode(["success" => true, "message" => "Estado actualizado con éxito."]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error al actualizar la base de datos."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos enviados a la API."]);
}
?>