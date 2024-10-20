<?php
// *************************************************************************
// Função para buscar um livro pelo código
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
if (!$data || !isset($data['codigo_do_livro'])) {
    echo json_encode(['message' => 'Código do cadastro do livro não foi enviado']);
    exit;
}

// Dados do formulário e filtra-os
$codigoLivro = $data['codigo_do_livro'];

// Prepara a consulta SQL utilizando prepared statement
$query = "SELECT codigoLivro, nomeLivro, nomeAutor, assuntosLivro, nomeEditora, numeroEdicao, localPublicacao, anoPublicacao, numeroExemplar, dataInclusao, dataExclusao
          FROM livros
          WHERE codigoLivro = ?";
$stmt = $conn->prepare($query);

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param('s', $codigoLivro);

// Execute a consulta
$stmt->execute();

// Verifica se o livro foi encontrado
$result = $stmt->get_result();

// Verifica se o livro foi encontrado
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Cadastro do livro não encontrado ou já excluído!']);
    exit;
}

// Busca o resultado como array associativo
$livro = $result->fetch_assoc();
$dataExclusao = $livro['dataExclusao'];

// Aplicar o filtro de exclusão
if ($dataExclusao !== '00:00:00 - 00/00/0000') {
    echo json_encode(['success' => false, 'message' => 'Cadastro do livro não encontrado ou já excluído!']);
    exit;
}

// Consulta para verificar se o leitor possui empréstimos ativos
$queryEmprestimos = "SELECT dataRetirada, dataDevolucao, dataEntrega
                     FROM emprestimos
                     WHERE codigoLivro = ? AND dataEntrega = '00:00:00 - 00/00/0000'";
$stmtEmprestimos = $conn->prepare($queryEmprestimos);
$stmtEmprestimos->bind_param('s', $codigoLivro);
$stmtEmprestimos->execute();
$resultEmprestimos = $stmtEmprestimos->get_result();

if ($resultEmprestimos->num_rows > 0) {
    // Se existem empréstimos ativos
    $emprestimo = $resultEmprestimos->fetch_assoc();
    echo json_encode([
        'success' => false,
        'message' => "Livro emprestado desde {$emprestimo['dataRetirada']} com data de devolução para {$emprestimo['dataDevolucao']}"
    ]);
} else {
    // Se não há empréstimos ativos
    echo json_encode([
        'success' => true,
        'nome_do_livro' => $livro['nomeLivro'],
    ]);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>