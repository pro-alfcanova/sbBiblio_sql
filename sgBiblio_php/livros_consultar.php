<?php
// *************************************************************************
// Função para buscar livros com filtro
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
if (!$data || !isset($data['filtro'])) {
    echo json_encode(['success' => false, 'message' => 'Filtro não foi fornecido.']);
    exit;
}

// Dados do formulário e filtra-os
$filtro = $data['filtro'];

// Inicializa o array para armazenar os livros
$livros = [];

// Prepara a consulta SQL
$query = "SELECT codigoLivro, nomeLivro, nomeAutor, assuntosLivro, nomeEditora, numeroEdicao, localPublicacao, anoPublicacao, numeroExemplar, dataInclusao, dataExclusao FROM livros";

// Execute a consulta
$result = $conn->query($query);

// Verifica o resultado
if ($result->num_rows > 0) {
    // Iterar sobre os resultados
    while ($livro = $result->fetch_assoc()) {
        $dataExclusao = $livro['dataExclusao'];

        // Aplicar os filtros
        if (($filtro === "Ativos" && $dataExclusao === '00:00:00 - 00/00/0000') ||
            ($filtro === "Excluídos" && $dataExclusao !== '00:00:00 - 00/00/0000') ||
            ($filtro === "Total")) {

            // Adiciona o livro ao array
            $livros[] = [
                'codigo_do_livro' => $livro['codigoLivro'],
                'nome_do_livro' => $livro['nomeLivro'],
                'nome_do_autor' => $livro['nomeAutor'],
                'assuntos_do_livro' => $livro['assuntosLivro'],
                'nome_da_editora' => $livro['nomeEditora'],
                'numero_da_edicao' => $livro['numeroEdicao'],
                'local_de_publicacao' => $livro['localPublicacao'],
                'ano_de_publicacao' => $livro['anoPublicacao'],
                'numero_do_exemplar' => $livro['numeroExemplar'],
                'data_de_inclusao' => $livro['dataInclusao'],
                'data_de_exclusao' => $livro['dataExclusao']
            ];
        }
    }
}

// Verifica se há livros encontrados
if (!empty($livros)) {
    echo json_encode(['success' => true, 'livros' => $livros]);
} else {
    echo json_encode(['success' => false, 'message' => 'Nenhum livro encontrado.']);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>