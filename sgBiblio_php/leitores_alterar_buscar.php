<?php
// *************************************************************************
// Função para buscar um leitor pelo código
// *************************************************************************

// Inclui o arquivo de conexão com o banco de dados
include "conecta_sgbiblio.php";

// Manipulação de data hora
include './datahora_ISO.php';
include './datahora_PTBR.php';

// Define o fuso horário para o horário local
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
if (empty($data['codigo_do_leitor'])) {
    echo json_encode(['success' => false, 'message' => 'Código do cadastro do leitor não foi enviado.']);
    exit;
}

// Dados do formulário e filtra-os
$codigoLeitor = $data['codigo_do_leitor'];

// Prepara a consulta SQL utilizando prepared statement
$query = "SELECT codigoLeitor, nomeLeitor, funcaoLeitor, localLeitor, contatoLeitor, dataInclusao, dataExclusao
          FROM leitores
          WHERE codigoLeitor = ?";
$stmt = $conn->prepare($query);

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param('s', $codigoLeitor);

// Execute a consulta
$stmt->execute();

// Obtêm os resultados
$result = $stmt->get_result();

// Verifica se o leitor foi encontrado
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Cadastro do leitor não encontrado ou já excluído!']);
    exit;
}

// Busca o resultado como array associativo
$leitor = $result->fetch_assoc();
$dataExclusao = $leitor['dataExclusao'];

// Aplicar o filtro de exclusão
if ($dataExclusao !== '00:00:00 - 00/00/0000') {
    echo json_encode(['success' => false, 'message' => 'Cadastro do leitor não encontrado ou já excluído!']);
    exit;
}

// Consulta para verificar se o leitor possui empréstimos ativos
$queryEmprestimos = "SELECT dataRetirada, dataDevolucao, dataEntrega
                     FROM emprestimos
                     WHERE codigoLeitor = ? AND dataEntrega = '00:00:00 - 00/00/0000'";
$stmtEmprestimos = $conn->prepare($queryEmprestimos);
$stmtEmprestimos->bind_param('s', $codigoLeitor);
$stmtEmprestimos->execute();
$resultEmprestimos = $stmtEmprestimos->get_result();

if ($resultEmprestimos->num_rows > 0) {
    // Se existem empréstimos ativos
    $emprestimo = $resultEmprestimos->fetch_assoc();
    echo json_encode([
        'success' => false,
        'message' => "Leitor possui um empréstimo desde {$emprestimo['dataRetirada']} com data de devolução para {$emprestimo['dataDevolucao']}"
    ]);
} else {
    // Se não há empréstimos ativos
    echo json_encode([
        'success' => true,
        'nome_do_leitor' => $leitor['nomeLeitor'],
    ]);
}

// Fecha as declarações
$stmtEmprestimos->close();
$stmt->close();
$conn->close();
?>