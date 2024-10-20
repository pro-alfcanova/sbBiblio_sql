<?php
// *************************************************************************
// Função para buscar empréstimos com filtro
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

// Inicializa o array para armazenar os emprestimos
$emprestimos = [];

// Prepara a consulta SQL
$query = "
    SELECT emprestimos.*, leitores.nomeLeitor AS nome_do_leitor, livros.nomeLivro AS nome_do_livro
    FROM emprestimos
    INNER JOIN leitores ON emprestimos.codigoLeitor = leitores.codigoLeitor
    INNER JOIN livros ON emprestimos.codigoLivro = livros.codigoLivro";

// Execute a consulta
$result = $conn->query($query);

// Verifica o resultado
if ($result->num_rows > 0) {
    // Iterar sobre os resultados
    while ($emprestimo = $result->fetch_assoc()) {
        $dataRetirada = $emprestimo['dataRetirada'];
        $dataDevolucao = $emprestimo['dataDevolucao'];
        list($horaDevolucao, $dataDevolucao) = explode(' - ', $dataDevolucao);
        list($dia, $mes, $ano) = explode('/', $dataDevolucao);
        $dataDevolucaoFormatada = "$ano/$mes/$dia - $horaDevolucao";
        $dataEntrega = $emprestimo['dataEntrega'];
        $dataAtual = date('Y/m/d - H:i:s');

        // Aplicar os filtros
        if (($filtro === "Abertos" && $dataDevolucaoFormatada > $dataAtual && $dataEntrega === '00:00:00 - 00/00/0000') ||
            ($filtro === "Atrasados" && $dataDevolucaoFormatada < $dataAtual && $dataEntrega === '00:00:00 - 00/00/0000') ||
            ($filtro === "Entregues" && $dataEntrega !== '00:00:00 - 00/00/0000') ||
            ($filtro === "Total")) {

            // Adiciona o emprestimo ao array
            $emprestimos[] = [
                'codigo_do_emprestimo' => $emprestimo['codigoEmprestimo'],
                'codigo_do_livro' => $emprestimo['codigoLivro'],
                'nome_do_livro' => $emprestimo['nomeLivro'],
                'codigo_do_leitor' => $emprestimo['codigoLeitor'],
                'nome_do_leitor' => $emprestimo['nomeLeitor'],
                'data_de_retirada' => $emprestimo['dataRetirada'],
                'data_de_devolucao' => $emprestimo['dataDevolucao'],
                'data_de_entrega' => $emprestimo['dataEntrega']
            ];
        }
    }
}

// Verifica se há emprestimos encontrados
if (!empty($emprestimos)) {
    echo json_encode(['success' => true, 'emprestimos' => $emprestimos]);
} else {
    echo json_encode(['success' => false, 'message' => 'Nenhum empréstimo encontrado.']);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>