<?php
// *************************************************************************
// Função para excluir os dados de um empréstimo existente
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
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha todos os campos.']);
    exit;
}
	
// Dados do formulário e filtra-os
$codigoEmprestimo = htmlspecialchars($data['codigo_do_emprestimo']);
$codigoLivro = htmlspecialchars($data['codigo_do_livro']);
$nomeLivro = htmlspecialchars($data['nome_do_livro']);
$codigoLeitor = htmlspecialchars($data['codigo_do_leitor']);
$nomeLeitor = htmlspecialchars($data['nome_do_leitor']);
$dataRetirada = htmlspecialchars($data['data_de_retirada']);
$dataDevolucao = htmlspecialchars($data['data_de_devolucao']);
$dataEntrega = obterDataHora();

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("UPDATE emprestimos
                        SET dataEntrega = ?
						WHERE codigoEmprestimo = ?");

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param("ss", $dataEntrega, $codigoEmprestimo);

// Execute a consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Entrega realizada com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Empréstimo não encontrado ou já foi entregue!']);
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