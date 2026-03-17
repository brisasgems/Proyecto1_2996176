<?php
// Configuración para Supabase PostgreSQL
$host = $_ENV['SUPABASE_HOST'] ?? "localhost";
$port = $_ENV['SUPABASE_PORT'] ?? "5432";
$db   = $_ENV['SUPABASE_DATABASE'] ?? "postgres";
$user = $_ENV['SUPABASE_USER'] ?? "postgres";
$pass = $_ENV['SUPABASE_PASSWORD'] ?? "";

// DSN para PostgreSQL
$dsn = "pgsql:host=$host;port=$port;dbname=$db;user=$user;password=$pass";

// Opciones PDO para PostgreSQL
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::ATTR_PERSISTENT         => false
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    error_log("Error de conexión Supabase: " . $e->getMessage());
    die("Error crítico: No se pudo conectar a Supabase. Verifica las variables de entorno.");
}
?>
