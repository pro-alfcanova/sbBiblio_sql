<?php
// *************************************************************************
// Função para excluir um leitor
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

// Captura os dados do POST
$data = json_decode(file_get_contents('php://input'), true);

// Validação básica dos dados recebidos
if (empty($data['codigo_do_leitor']) || empty($data['nome_do_leitor']) ||
    empty($data['funcao_do_leitor']) || empty($data['local_do_leitor']) ||
	empty($data['contato_do_leitor'])) {
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha <strong>todos</strong> os campos.']);
    exit;
}

// Obtém os dados do leitor e filtra-os
$codigoLeitor = htmlspecialchars($data['codigo_do_leitor']);
$nomeLeitor = htmlspecialchars($data['nome_do_leitor']);
$funcaoLeitor = htmlspecialchars($data['funcao_do_leitor']);
$localLeitor = htmlspecialchars($data['local_do_leitor']);
$contatoLeitor = htmlspecialchars($data['contato_do_leitor']);
$dataExclusao = obterDataHora();

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("UPDATE leitores
                        SET dataExclusao = ?
						WHERE codigoLeitor = ?");

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param("ss", $dataExclusao, $codigoLeitor);

// Execute a consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Cadastro do leitor excluído com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cadastro do leitor não encontrado ou já excluído!']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Erro: ' . $stmt->error]);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>