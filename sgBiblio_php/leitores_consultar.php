<?php
// *************************************************************************
// Função para buscar usuários com filtro
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

// Receber os dados enviados do cliente
$data = json_decode(file_get_contents('php://input'), true);

// Validação básica dos dados recebidos
if (!$data || !isset($data['filtro'])) {
    echo json_encode(['success' => false, 'message' => 'Filtro não foi fornecido.']);
    exit;
}

// Dados do formulário e filtra-os
$filtro = $data['filtro'];

// Inicializa o array para armazenar os leitores
$leitores = [];

// Prepara a consulta SQL
$query = "SELECT codigoLeitor, nomeLeitor, funcaoLeitor, localLeitor, contatoLeitor, dataInclusao, dataExclusao FROM leitores";

// Execute a consulta
$result = $conn->query($query);

// Verifica o resultado
if ($result->num_rows > 0) {
    // Iterar sobre os resultados
    while ($leitor = $result->fetch_assoc()) {
        $dataExclusao = $leitor['dataExclusao'];

        // Aplicar os filtros
        if (($filtro === "Ativos" && $dataExclusao === '00:00:00 - 00/00/0000') ||
            ($filtro === "Excluídos" && $dataExclusao !== '00:00:00 - 00/00/0000') ||
            ($filtro === "Total")) {

            // Adiciona o leitores ao array
            $leitores[] = [
                'codigo_do_leitor' => $leitor['codigoLeitor'],
                'nome_do_leitor' => $leitor['nomeLeitor'],
                'funcao_do_leitor' => $leitor['funcaoLeitor'],
                'local_do_leitor' => $leitor['localLeitor'],
                'contato_do_leitor' => $leitor['contatoLeitor'],
                'data_de_inclusao' => $leitor['dataInclusao'],
                'data_de_exclusao' => $leitor['dataExclusao']
            ];
        }
    }
}

// Verifica se há leitores encontrados
if (!empty($leitores)) {
    echo json_encode(['success' => true, 'leitores' => $leitores]);
} else {
    echo json_encode(['success' => false, 'message' => 'Nenhum leitor encontrado.']);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>