<?php
// Conectar ao banco de Dados

// Defina o fuso horário para o horário local
date_default_timezone_set('America/Sao_Paulo');

// Dados do banco de dados
$servername = "localhost";
$username = "sgBiblioAdmin";
$password = "sgBiblioPasswd";
$database = "sgBiblio";

// Conexão com o banco de dados
$conn = new mysqli($servername, $username, $password, $database);

// Verifique a conexão
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados: ' . $conn->connect_error]));
}
?>