<?php
// *************************************************************************
// Função para buscar o próximo código de emprestimo
// *************************************************************************

// Inclui o arquivo de conexão com o banco de dados
include "conecta_sgbiblio.php";

// Manipulação de data hora
include './datahora_ISO.php';
include './datahora_PTBR.php';

// Defina o fuso horário para o horário local
date_default_timezone_set('America/Sao_Paulo');

// Verifique a conexão
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados: ' . $conn->connect_error]));
}

// Define o header JSON
header('Content-Type: application/json');

// Buscar o último número do tombo
$sql = "SELECT MAX(codigoEmprestimo) AS ultimo_codigo FROM emprestimos";
$result = $conn->query($sql);

// Inicializa a variável para armazenar o último código
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $ultimo_codigo = $row["ultimo_codigo"] + 1;
} else {
    $ultimo_codigo = 1;
}

// Retorna o valor do último código
echo json_encode(['success' => true, 'ultimo_codigo' => $ultimo_codigo]);

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>