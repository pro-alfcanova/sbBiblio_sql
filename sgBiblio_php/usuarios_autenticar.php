<?php
// Autenticar usuário

// Inclui o arquivo de conexão com o banco de dados
include "conecta_sgbiblio.php";

// Manipulação de data hora
include './datahora_ISO.php';
include './datahora_PTBR.php';

// Defina o fuso horário para o horário local
date_default_timezone_set('America/Sao_Paulo');

// Define o header JSON
header('Content-Type: application/json');

// Configura os parâmetros do cookie da sessão
session_set_cookie_params([
    'lifetime' => 0, // Cookie expira quando o navegador é fechado
    // 'path' => '/', // Disponível em todo o site
    // 'domain' => '', // Substitua pelo domínio, se necessário
    // 'secure' => true, // Habilita o envio apenas via HTTPS
    // 'httponly' => true, // Previne acesso via JavaScript
    // 'samesite' => 'None' // Permite o envio em contextos de terceiros
]);

// Verifica se a sessão já está iniciada
if (session_status() === PHP_SESSION_ACTIVE) {
    // Se houver uma sessão ativa, destrua-a
    session_unset();    // Limpa todas as variáveis de sessão
    session_destroy();  // Destroi a sessão atual
}

// Inicia uma nova sessão
session_start();

// Verifique a conexão
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados: ' . $conn->connect_error]));
}

// Captura os dados do POST
$data = json_decode(file_get_contents('php://input'), true);

// Validação básica dos dados recebidos
if (empty($data['login_usuario']) || empty($data['senha_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Por favor, preencha todos os campos.']);
    exit;
}

// Obtém os dados de login
$loginUsuario = $data['login_usuario'] ?? '';
$senhaUsuario = $data['senha_usuario'] ?? '';

// Prepara a consulta SQL utilizando prepared statement
$sql = "SELECT * FROM usuarios
        WHERE loginUsuario = ? AND senhaUsuario = ?";
$stmt = $conn->prepare($sql);

// Vincule os parâmetros com os valores (s -> string, i -> integer)
$stmt->bind_param('ss', $loginUsuario, $senhaUsuario);

// Execute a consulta
$stmt->execute();

// Inicializa a variável como um array
$usuarios = [];

// Verifica se o usuário foi encontrado
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    // Busca os usuários correspondentes
    while ($usuario = $result->fetch_assoc()) {
        $usuarios[] = $usuario;
    }

    // Se o usuário for encontrado, define a sessão
    $papelUsuario = $usuarios[0]['nomeUsuario'];
    $_SESSION['papel'] = $papelUsuario;

    // Armazena os dados em dados.json
    $dados = [
        'username' => $loginUsuario,
        'papel' => $papelUsuario
    ];
    file_put_contents('dados.json', json_encode($dados));

    echo json_encode(['success' => true, 'papel' => $_SESSION['papel'], 'message' => 'Usuário autenticado com sucesso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos.']);
}

// Fecha a declaração e a conexão, garantindo que não cause erro se não forem definidos
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>