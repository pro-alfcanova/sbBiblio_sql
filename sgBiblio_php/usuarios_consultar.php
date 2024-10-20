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

// Captura os dados do POST
$data = json_decode(file_get_contents('php://input'), true);

// Validação básica dos dados recebidos
if (!$data || !isset($data['filtro'])) {
    echo json_encode(['success' => false, 'message' => 'Filtro não foi fornecido.']);
    exit;
}

// Dados do formulário e filtra-os
$filtro = $data['filtro'];

// Inicializa o array para armazenar os usuários
$usuarios = [];

// Prepara a consulta SQL
$query = "SELECT nomeUsuario, contatoUsuario, loginUsuario, senhaUsuario, dataInclusao, dataExclusao FROM usuarios";

// Execute a consulta
$result = $conn->query($query);

// Verifica o resultado
if ($result->num_rows > 0) {
    // Iterar sobre os resultados
    while ($usuario = $result->fetch_assoc()) {
        $dataExclusao = $usuario['dataExclusao'];

        // Aplicar os filtros
        if (($filtro === "Ativos" && $dataExclusao === '00:00:00 - 00/00/0000') ||
            ($filtro === "Excluídos" && $dataExclusao !== '00:00:00 - 00/00/0000') ||
            ($filtro === "Total")) {

            // Adiciona o usuário ao array
            $usuarios[] = [
                'nome_do_usuario' => $usuario['nomeUsuario'],
                'contato_do_usuario' => $usuario['contatoUsuario'],
                'login_do_usuario' => $usuario['loginUsuario'],
                'senha_do_usuario' => $usuario['senhaUsuario'],
                'data_de_inclusao' => $usuario['dataInclusao'],
                'data_de_exclusao' => $usuario['dataExclusao']
            ];
        }
    }
}

// Verifica se há usuários encontrados
if (!empty($usuarios)) {
    echo json_encode(['success' => true, 'usuarios' => $usuarios]);
} else {
    echo json_encode(['success' => false, 'message' => 'Nenhum usuário encontrado!']);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>