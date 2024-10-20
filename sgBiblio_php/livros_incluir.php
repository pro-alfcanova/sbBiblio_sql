<?php
// *************************************************************************
// Função para incluir um novo livro
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
if (empty($data['codigo_do_livro']) || empty($data['nome_do_livro']) || empty($data['nome_do_autor']) || empty($data['assuntos_do_livro']) ||
	empty($data['nome_da_editora']) || empty($data['numero_da_edicao']) || empty($data['local_de_publicacao']) ||
	empty($data['ano_de_publicacao']) || empty($data['numero_do_exemplar'])) {
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha <strong>todos</strong> os campos.']);
    exit;
}

// Dados do formulário e filtra-os
$codigoLivro = htmlspecialchars($data['codigo_do_livro']);
$nomeLivro = htmlspecialchars($data['nome_do_livro']);
$nomeAutor = htmlspecialchars($data['nome_do_autor']);
$assuntosLivro = htmlspecialchars($data['assuntos_do_livro']);
$nomeEditora = htmlspecialchars($data['nome_da_editora']);
$numeroEdicao = htmlspecialchars($data['numero_da_edicao']);
$localPublicacao = htmlspecialchars($data['local_de_publicacao']);
$anoPublicacao = (int)$data['ano_de_publicacao'];
$numeroExemplar = (int)$data['numero_do_exemplar'];
$dataInclusao = obterDataHora();
$dataExclusao = '00:00:00 - 00/00/0000';

// Verifica se o cadastro do livro já existe
$stmt_check = $conn->prepare("SELECT * FROM livros WHERE codigoLivro = ?");
$stmt_check->bind_param("i", $codigoLivro);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Já existe um livro cadastrado com este código!']);
    exit;
}

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("INSERT INTO livros (codigoLivro, nomeLivro, nomeAutor, assuntosLivro, nomeEditora, numeroEdicao, localPublicacao, anoPublicacao, numeroExemplar, dataInclusao, dataExclusao)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param("ssssssssiss", $codigoLivro, $nomeLivro, $nomeAutor, $assuntosLivro, $nomeEditora, $numeroEdicao, $localPublicacao, $anoPublicacao, $numeroExemplar, $dataInclusao, $dataExclusao);

// Execute a consulta
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cadastro do livro incluído com sucesso!']);
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