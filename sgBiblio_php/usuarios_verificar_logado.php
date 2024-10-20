<?php
// Verificar usuário

// Define o header JSON
header('Content-Type: application/json');

// Lê o arquivo dados.json
$response = [];

if (file_exists('dados.json')) {
    $dadosJson = file_get_contents('dados.json');
    $dados = json_decode($dadosJson, true);

    // Verifica se o papel está definido no arquivo
    if ($dados && isset($dados['papel'])) {
        $response['success'] = true;
        $response['papel'] = $dados['papel'];
        $response['message'] = 'Papel recuperado com sucesso.';
    } else {
        $response['success'] = false;
        $response['message'] = 'Papel não encontrado no arquivo de dados.';
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Arquivo de dados não encontrado.';
}

// Retorna a resposta como JSON
echo json_encode($response);
?>