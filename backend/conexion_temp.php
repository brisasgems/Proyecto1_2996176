<?php
// Configuración de conexión para XAMPP
$host = "localhost";
$port = "3307"; // Puerto que estás usando
$db   = "restaurante"; // Nombre correcto de la base de datos
$user = "root"; // Usuario por defecto de XAMPP
$pass = ""; // Contraseña por defecto de XAMPP (vacía)

// DSN con el puerto incluido
$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

// Mejores prácticas para PDO
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lanza excepciones en caso de error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Devuelve arrays asociativos por defecto
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Usa sentencias preparadas reales (mayor seguridad)
    PDO::ATTR_PERSISTENT         => false                    // No usar conexiones persistentes
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Evita mostrar datos sensibles en pantalla en un entorno real
    error_log("Error de conexión: " . $e->getMessage());
    die("Error crítico: No se pudo conectar a la base de datos. Verifica que:<br>
           1. MySQL esté iniciado en XAMPP<br>
           2. La base de datos 'restaurante' exista<br>
           3. El puerto 3307 esté disponible");
}
?>
