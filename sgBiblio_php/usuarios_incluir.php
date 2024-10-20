<?php
// *************************************************************************
// Função para incluir um novo usuário
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
if (empty($data['nome_do_usuario']) || empty($data['contato_do_usuario']) ||
    empty($data['login_do_usuario']) ||
	empty($data['senha_do_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha <strong>todos</strong> os campos.']);
    exit;
}

// Dados do formulário e filtra-os
$nomeUsuario = htmlspecialchars($data['nome_do_usuario']);
$contatoUsuario = htmlspecialchars($data['contato_do_usuario']);
$loginUsuario = htmlspecialchars($data['login_do_usuario']);
$senhaUsuario = htmlspecialchars($data['senha_do_usuario']);
// $senhaUsuario = password_hash($data['senha_do_usuario'], PASSWORD_BCRYPT); // Criptografa a senha
$dataInclusao = obterDataHora();
$dataExclusao = '00:00:00 - 00/00/0000';

// Verifica se já existe um usuário com esse login
$stmt_check = $conn->prepare("SELECT * FROM usuarios WHERE loginUsuario = ?");
$stmt_check->bind_param("s", $loginUsuario);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Já existe um usuário cadastrado com este login!']);
    exit;
}

// Verifica se já existe um usuário com esse nome
$stmt_check = $conn->prepare("SELECT * FROM usuarios WHERE nomeUsuario = ?");
$stmt_check->bind_param("s", $nomeUsuario);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Já existe um usuário cadastrado com este nome!']);
    exit;
}

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("INSERT INTO usuarios (nomeUsuario, contatoUsuario, loginUsuario, senhaUsuario, dataInclusao, dataExclusao) 
                        VALUES (?, ?, ?, ?, ?, ?)");

// Vincule os parâmetros com os valores (s -> string)
$stmt->bind_param("ssssss", $nomeUsuario, $contatoUsuario, $loginUsuario, $senhaUsuario, $dataInclusao, $dataExclusao);

// Execute a consulta
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cadastro do usuário incluído com sucesso!']);
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