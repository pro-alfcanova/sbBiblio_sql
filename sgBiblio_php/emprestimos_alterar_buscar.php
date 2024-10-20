<?php
// *************************************************************************
// Função para buscar um empréstimo pelo código de maneira otimizada
// *************************************************************************

// Inclui o arquivo de conexão com o banco de dados
include "conecta_sgbiblio.php";

// Manipulação de data hora
include './datahora_ISO.php';
include './datahora_PTBR.php';

// Defina o fuso horário para o horário local
date_default_timezone_set('America/Sao_Paulo');

// Define o header JSON
header('Content-Type: application/json');

// Verifique a conexão
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados: ' . $conn->connect_error]));
}

// Captura os dados do POST
$data = json_decode(file_get_contents('php://input'), true);

// Validação básica dos dados recebidos
if (empty($data['codigo_do_emprestimo'])) {
    echo json_encode(['success' => false, 'message' => 'Código do empréstimo não foi enviado']);
    exit;
}

// Dados do formulário
$codigoEmprestimo = $data['codigo_do_emprestimo'];

try {
    // Prepara a consulta SQL para buscar o empréstimo e verificar se o livro ou leitor estão excluídos
    $query = "
        SELECT e.codigoEmprestimo, e.codigoLivro, li.nomeLivro AS nomeLivro, e.codigoLeitor, le.nomeLeitor AS nomeLeitor, 
               e.dataRetirada, e.dataDevolucao, e.dataEntrega, li.dataExclusao AS livroExcluido, le.dataExclusao AS leitorExcluido
        FROM emprestimos e
        JOIN livros li ON e.codigoLivro = li.codigoLivro
        JOIN leitores le ON e.codigoLeitor = le.codigoLeitor
        WHERE e.codigoEmprestimo = ?
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $codigoEmprestimo);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verifica se o empréstimo foi encontrado
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Empréstimo não encontrado!']);
        exit;
    }

    // Busca os dados do empréstimo
    $emprestimo = $result->fetch_assoc();

    // Verifica se o livro ou o leitor estão excluídos
    if ($emprestimo['livroExcluido'] !== '00:00:00 - 00/00/0000') {
        echo json_encode(['success' => false, 'message' => 'O livro associado ao empréstimo está excluído!']);
        exit;
    }

    if ($emprestimo['leitorExcluido'] !== '00:00:00 - 00/00/0000') {
        echo json_encode(['success' => false, 'message' => 'O leitor associado ao empréstimo está excluído!']);
        exit;
    }

    // Verifica se o empréstimo já foi devolvido
    if ($emprestimo['dataEntrega'] !== '00:00:00 - 00/00/0000') {
        echo json_encode(['success' => false, 'message' => 'Empréstimo já devolvido!']);
        exit;
    }

    // Retorna os dados do empréstimo
    echo json_encode([
        'success' => true,
        'codigo_do_emprestimo' => $emprestimo['codigoEmprestimo'],
        'codigo_do_livro' => $emprestimo['codigoLivro'],
        'nome_do_livro' => $emprestimo['nomeLivro'],
        'codigo_do_leitor' => $emprestimo['codigoLeitor'],
        'nome_do_leitor' => $emprestimo['nomeLeitor'],
        'data_de_retirada' => $emprestimo['dataRetirada'],
        'data_de_devolucao' => $emprestimo['dataDevolucao'],
        'data_de_entrega' => $emprestimo['dataEntrega']
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao processar a solicitação: ' . $e->getMessage()]);
} finally {
    // Fechar as conexões e as declarações
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>