<?php
// *************************************************************************
// Função para buscar um usuario pelo nome
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
if (!$data || !isset($data['nome_do_usuario'])) {
    echo json_encode(['message' => 'Nome do cadastro do usuário não foi enviado.']);
    exit;
}

// Dados do formulário e filtra-os
$nomeUsuario = $data['nome_do_usuario'];

// Prepara a consulta SQL utilizando prepared statement
$query = "SELECT nomeUsuario, contatoUsuario, loginUsuario, senhaUsuario, dataInclusao, dataExclusao
          FROM usuarios
          WHERE nomeUsuario = ?";
$stmt = $conn->prepare($query);

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param('s', $nomeUsuario);

// Execute a consulta
$stmt->execute();

// Verifica se o usuário foi encontrado
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    // Busca o resultado como array associativo
    $usuario = $result->fetch_assoc();
    $dataExclusao = $usuario['dataExclusao'];

    // Aplicar o filtro de exclusão
    if ($dataExclusao === '00:00:00 - 00/00/0000') {
        echo json_encode([
            'success' => true,
            'nome_do_usuario' => $usuario['nomeUsuario'],
            'contato_do_usuario' => $usuario['contatoUsuario'],
            'login_do_usuario' => $usuario['loginUsuario'],
            'senha_do_usuario' => $usuario['senhaUsuario']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cadastro do usuário não encontrado ou já excluído!']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Cadastro do usuário não encontrado ou já excluído!']);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>