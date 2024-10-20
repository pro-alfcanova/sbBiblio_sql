<?php
// *************************************************************************
// Função para alterar os dados de um usuário existente
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

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("UPDATE usuarios
                        SET nomeUsuario = ?, contatoUsuario = ?, senhaUsuario = ?
						WHERE loginUsuario = ?");

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param("ssss", $nomeUsuario, $contatoUsuario, $senhaUsuario, $loginUsuario);

// Execute a consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Cadastro do usuário atualizado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cadastro do usuário não encontrado ou já excluído!']);
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