<?php
// *************************************************************************
// Função para incluir um novo empréstimo
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
if (empty($data['codigo_do_emprestimo']) || empty($data['codigo_do_livro']) || empty($data['nome_do_livro']) ||
    empty($data['codigo_do_leitor']) || empty($data['nome_do_leitor']) ||
	empty($data['data_de_retirada']) || empty($data['data_de_devolucao'])) {
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha <strong>todos</strong> os campos.']);
    exit;
}

// Dados do formulário e filtra-os
$codigoEmprestimo = htmlspecialchars($data['codigo_do_emprestimo']);
$codigoLivro = htmlspecialchars($data['codigo_do_livro']);
$nomeLivro = htmlspecialchars($data['nome_do_livro']);
$codigoLeitor = htmlspecialchars($data['codigo_do_leitor']);
$nomeLeitor = htmlspecialchars($data['nome_do_leitor']);
$dataRetiradaForm = htmlspecialchars($data['data_de_retirada']);
$dataRetirada = converterDataPTBR($dataRetiradaForm);
$dataDevolucaoForm = htmlspecialchars($data['data_de_devolucao']);
$dataDevolucao = converterDataPTBR($dataDevolucaoForm);
$dataEntrega = '00:00:00 - 00/00/0000';

// Verifica se o cadastro do empréstimo já existe
$stmt_check = $conn->prepare("SELECT * FROM emprestimos WHERE codigoEmprestimo = ?");
$stmt_check->bind_param("s", $codigoEmprestimo);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Esse cadastro já existe!']);
    exit;
}

// Verifica se o livro já está emprestado
$stmt_check_livros = $conn->prepare("SELECT * FROM emprestimos WHERE codigoLivro = ? ORDER BY dataRetirada DESC LIMIT 1");
$stmt_check_livros->bind_param("s", $codigoLivro);
$stmt_check_livros->execute();
$result_check_livros = $stmt_check_livros->get_result();

// Verifica se o livro foi encontrado na tabela empréstimos
if ($result_check_livros->num_rows > 0) {
    // Busca o resultado como array associativo
    $emprestimo = $result_check_livros->fetch_assoc();
    $dataDevolucao = $emprestimo['dataDevolucao'];
    $dataEntrega = $emprestimo['dataEntrega'];

    // Verifica se o livro ainda está emprestado
    if ($dataDevolucao !== '00:00:00 - 00/00/0000' && $dataEntrega === '00:00:00 - 00/00/0000') {
        echo json_encode(['success' => false, 'message' => 'O livro ainda não foi devolvido!']);
        exit;
    }
}

// Verifica se o leitor já possui empréstimos não devolvidos
$stmt_check_leitor = $conn->prepare("SELECT COUNT(*) AS total_emprestimos FROM emprestimos WHERE codigoLeitor = ? AND dataDevolucao != '00:00:00 - 00/00/0000' AND dataEntrega = '00:00:00 - 00/00/0000'");
$stmt_check_leitor->bind_param("s", $codigoLeitor);
$stmt_check_leitor->execute();
$result_check_leitor = $stmt_check_leitor->get_result();
$total_emprestimos = $result_check_leitor->fetch_assoc()['total_emprestimos'];

if ($total_emprestimos >= 1) {
    echo json_encode(['success' => false, 'message' => 'O leitor já possui um empréstimo não devolvido!']);
    exit;
}

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("INSERT INTO emprestimos (codigoEmprestimo, codigoLivro, nomeLivro, codigoLeitor, nomeLeitor, dataRetirada, dataDevolucao, dataEntrega)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

// Vincule os parâmetros com os valores (s -> string, i -> integer)		
$stmt->bind_param("ssssssss", $codigoEmprestimo, $codigoLivro, $nomeLivro, $codigoLeitor, $nomeLeitor, $dataRetirada, $dataDevolucao, $dataEntrega);

// Execute a consulta
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cadastro do empréstimo incluído com sucesso!']);
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