<?php
// *************************************************************************
// Função para incluir um novo leitor
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

// Dados do formulário e filtra-os
$codigoLeitor = htmlspecialchars($data['codigo_do_leitor']);
$nomeLeitor = htmlspecialchars($data['nome_do_leitor']);
$funcaoLeitor = htmlspecialchars($data['funcao_do_leitor']);
$localLeitor = htmlspecialchars($data['local_do_leitor']);
$contatoLeitor = htmlspecialchars($data['contato_do_leitor']);
$dataInclusao = obterDataHora();
$dataExclusao = '00:00:00 - 00/00/0000';

// Verifica se já existe esse cadastro do leitor
$stmt_check = $conn->prepare("SELECT * FROM leitores WHERE codigoLeitor = ?");
$stmt_check->bind_param("i", $codigoLeitor);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Já existe um leitor cadastrado com este código!']);
    exit;
}

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("INSERT INTO leitores (codigoLeitor, nomeLeitor, funcaoLeitor, localLeitor, contatoLeitor, dataInclusao, dataExclusao)
                        VALUES (?, ?, ?, ?, ?, ?, ?)");

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param("issssss", $codigoLeitor, $nomeLeitor, $funcaoLeitor, $localLeitor, $contatoLeitor, $dataInclusao, $dataExclusao);

// Execute a consulta
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cadastro do leitor incluído com sucesso!']);
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