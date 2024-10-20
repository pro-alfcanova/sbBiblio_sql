<?php
// Liberar usuário

// Define o header JSON
header('Content-Type: application/json');

// Lê o arquivo dados.json
$response = [];

// Verifica se a sessão já está iniciada
if (session_status() !== PHP_SESSION_ACTIVE) {
    // Se a sessão não estiver ativa, inicia uma nova sessão
    session_start();
}

// Verifica se o arquivo dados.json existe
if (file_exists('dados.json')) {
    // Remove o arquivo dados.json
    unlink('dados.json');
}

// Limpa todas as variáveis da sessão
session_unset();

// Destroi a sessão
session_destroy();

// Retorna uma mensagem de sucesso
$response['success'] = true;
$response['message'] = 'Usuário liberado';

// Envia a resposta como JSON
echo json_encode($response);
?>