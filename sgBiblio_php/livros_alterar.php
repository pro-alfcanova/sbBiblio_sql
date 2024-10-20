<?php
/// *************************************************************************
// Função para alterar os dados de um livro existente
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
$anoPublicacao = htmlspecialchars($data['ano_de_publicacao']);
$numeroExemplar = htmlspecialchars($data['numero_do_exemplar']);

// Prepara a consulta SQL utilizando prepared statement
$stmt = $conn->prepare("UPDATE livros
                        SET nomeLivro = ?, nomeAutor = ?, assuntosLivro = ?, nomeEditora = ?, numeroEdicao = ?, localPublicacao = ?, anoPublicacao = ?, numeroExemplar = ?
						WHERE codigoLivro = ?");

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param("sssssssss", $nomeLivro, $nomeAutor, $assuntosLivro, $nomeEditora, $numeroEdicao, $localPublicacao, $anoPublicacao, $numeroExemplar, $codigoLivro);

// Execute a consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Cadastro do livro alterado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cadastro do livro não encontrado ou já excluído!']);
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