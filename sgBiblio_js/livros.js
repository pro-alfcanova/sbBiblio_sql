// ****************************************************************************************
// Funções relativas aos módulo livros
// ****************************************************************************************

// ********************************************
// Função para buscar o próximo tombo do livro
// ********************************************
function buscarLivroTombo() {
    let ultimo_codigo = 0;

    // Consulta o banco de dados
    fetch('/sgBiblio/sgBiblio_php/livros_tombo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_livros_incluir').style.display = 'block';

        if (data.success) {
            document.getElementById("codigo_livro_incluir").value = data.ultimo_codigo;
        } else {
            showError(data.message || "Erro ao buscar o tombo do livro.");
            document.getElementById("codigo_livro_incluir").value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar o tombo do livro. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_incluir_livros
// ********************************************
function enviarFormularioIncluirLivro() {
    var codigoLivro = document.getElementById("codigo_livro_incluir").value;
    var nomeLivro = document.getElementById("nome_livro_incluir").value;
    var nomeAutor = document.getElementById("nome_autor_incluir").value;
    var assuntosLivro = document.getElementById("assuntos_livro_incluir").value;
    var nomeEditora = document.getElementById("nome_editora_incluir").value;
    var numeroEdicao = document.getElementById("numero_edicao_incluir").value;
    var localPublicacao = document.getElementById("local_publicacao_incluir").value;
    var anoPublicacao = document.getElementById("ano_publicacao_incluir").value;
    var numeroExemplar = document.getElementById("numero_exemplar_incluir").value;

    if (!codigoLivro || !nomeLivro || !nomeAutor || !assuntosLivro || !nomeEditora || !numeroEdicao || !localPublicacao || !anoPublicacao || !numeroExemplar) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoLivro <= "0") {
        showError("Digite o código novamente.");
        return;
    };

    var livroIncluir = {
        codigo_do_livro: codigoLivro,
        nome_do_livro: nomeLivro,
        nome_do_autor: nomeAutor,
        assuntos_do_livro: assuntosLivro,
        nome_da_editora: nomeEditora,
        numero_da_edicao: numeroEdicao,
        local_de_publicacao: localPublicacao,
        ano_de_publicacao: anoPublicacao,
        numero_do_exemplar: numeroExemplar
    };

    // Enviar os dados para o servidor usando fetch (AJAX)
    fetch('/sgBiblio/sgBiblio_php/livros_incluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(livroIncluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Livro cadastrado com sucesso!");
            closeModal('modal_livros_incluir');
        } else {
            showError(data.message || "Erro ao cadastrar livro.");
            var form = document.getElementById("formLivrosIncluir");
            form.reset();
        };
    })
    .catch(error => {
        showError("Erro ao cadastrar livro.");
        console.error('Erro ao cadastrar livro:', error);
    });
};

// ********************************************
// Função para buscar as informações do livro
// ********************************************
function buscarLivroAlterar() {
    var form = document.forms['formLivrosAlterar'];
    var codigo_livro = form['codigo_livro_alterar'].value;

    if (!codigo_livro) {
        showError("Código do livro não foi digitado.");
        return;
    };

    if (codigo_livro <= "0") {
        showError("Digite o código novamente.");
		document.getElementById('codigo_livro_alterar').value = '';
        return;
    };

    // Enviar o código do livro para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/livros_alterar_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_livro: codigo_livro })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_livros_alterar').style.display = 'block';

        if (data.success) {
            document.getElementById('nome_livro_alterar').value = data.nome_do_livro || '';
            document.getElementById('nome_autor_alterar').value = data.nome_do_autor || '';
            document.getElementById('assuntos_livro_alterar').value = data.assuntos_do_livro || '';
            document.getElementById('nome_editora_alterar').value = data.nome_da_editora || '';
            document.getElementById('numero_edicao_alterar').value = data.numero_da_edicao || '';
            document.getElementById('local_publicacao_alterar').value = data.local_de_publicacao || '';
            document.getElementById('ano_publicacao_alterar').value = data.ano_de_publicacao || '';
            document.getElementById('numero_exemplar_alterar').value = data.numero_do_exemplar || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do livro.");
            document.getElementById('codigo_livro_alterar').value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do livro. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_alterar_livros
// ********************************************
function enviarFormularioAlterarLivro() {
    var codigoLivro = document.getElementById("codigo_livro_alterar").value;
    var nomeLivro = document.getElementById("nome_livro_alterar").value;
    var nomeAutor = document.getElementById("nome_autor_alterar").value;
    var assuntosLivro = document.getElementById("assuntos_livro_alterar").value;
    var nomeEditora = document.getElementById("nome_editora_alterar").value;
    var numeroEdicao = document.getElementById("numero_edicao_alterar").value;
    var localPublicacao = document.getElementById("local_publicacao_alterar").value;
    var anoPublicacao = document.getElementById("ano_publicacao_alterar").value;
    var numeroExemplar = document.getElementById("numero_exemplar_alterar").value;

    if (!codigoLivro || !nomeLivro || !nomeAutor || !assuntosLivro || !nomeEditora || !numeroEdicao || !localPublicacao || !anoPublicacao || !numeroExemplar) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoLivro <= "0") {
        showError("Digite o código novamente.");
        return;
    };

    var livroAlterar = {
        codigo_do_livro: codigoLivro,
        nome_do_livro: nomeLivro,
        nome_do_autor: nomeAutor,
        assuntos_do_livro: assuntosLivro,
        nome_da_editora: nomeEditora,
        numero_da_edicao: numeroEdicao,
        local_de_publicacao: localPublicacao,
        ano_de_publicacao: anoPublicacao,
        numero_do_exemplar: numeroExemplar
    };

    // Enviar o codigo do livro a ser alterado para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/livros_alterar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(livroAlterar)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do livro alterado com sucesso!");
            closeModal('modal_livros_alterar');
        } else {
            showError(data.message || "Erro ao alterar cadastro do livro.");
        };
    })
    .catch(error => {
        showError("Erro ao alterar cadastro do livro. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para buscar as informações do livro
// ********************************************
function buscarLivroExcluir() {
    var form = document.forms['formLivrosExcluir'];
    var codigo_livro = form['codigo_livro_excluir'].value;

    if (!codigo_livro) {
        showError("Código do livro não foi digitado.");
        return;
    };

    if (codigo_livro <= "0") {
        showError("Digite o código novamente.");
        return;
    };

    // Enviar o código do livro para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/livros_excluir_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_livro: codigo_livro })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_livros_excluir').style.display = 'block';

        if (data.success) {
            document.getElementById('nome_livro_excluir').value = data.nome_do_livro || '';
            document.getElementById('nome_autor_excluir').value = data.nome_do_autor || '';
            document.getElementById('assuntos_livro_excluir').value = data.assuntos_do_livro || '';
            document.getElementById('nome_editora_excluir').value = data.nome_da_editora || '';
            document.getElementById('numero_edicao_excluir').value = data.numero_da_edicao || '';
            document.getElementById('local_publicacao_excluir').value = data.local_de_publicacao || '';
            document.getElementById('ano_publicacao_excluir').value = data.ano_de_publicacao || '';
            document.getElementById('numero_exemplar_excluir').value = data.numero_do_exemplar || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do livro.");
            document.getElementById('codigo_livro_excluir').value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do livro. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_excluir_livros
// ********************************************
function enviarFormularioExcluirLivro() {
    var codigoLivro = document.getElementById("codigo_livro_excluir").value;
    var nomeLivro = document.getElementById("nome_livro_excluir").value;
    var nomeAutor = document.getElementById("nome_autor_excluir").value;
    var assuntosLivro = document.getElementById("assuntos_livro_excluir").value;
    var nomeEditora = document.getElementById("nome_editora_excluir").value;
    var numeroEdicao = document.getElementById("numero_edicao_excluir").value;
    var localPublicacao = document.getElementById("local_publicacao_excluir").value;
    var anoPublicacao = document.getElementById("ano_publicacao_excluir").value;
    var numeroExemplar = document.getElementById("numero_exemplar_excluir").value;

    if (!codigoLivro || !nomeLivro || !nomeAutor || !assuntosLivro || !nomeEditora || !numeroEdicao || !localPublicacao || !anoPublicacao || !numeroExemplar) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoLivro <= "0") {
        showError("Digite o código novamente.");
        return;
    };

    var livroExcluir = {
        codigo_do_livro: codigoLivro,
        nome_do_livro: nomeLivro,
        nome_do_autor: nomeAutor,
        assuntos_do_livro: assuntosLivro,
        nome_da_editora: nomeEditora,
        numero_da_edicao: numeroEdicao,
        local_de_publicacao: localPublicacao,
        ano_de_publicacao: anoPublicacao,
        numero_do_exemplar: numeroExemplar
    };

    // Enviar o codigo do livro a ser excluído para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/livros_excluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(livroExcluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do livro excluído com sucesso!");
            closeModal('modal_livros_excluir');
        } else {
            showError(data.message || "Erro ao excluir cadastro do livro.");
        };
    })
    .catch(error => {
        showError("Erro ao excluir livro. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_consultar_livros
// ********************************************
function pesquisarLivros() {
    var ativosCheckbox = document.getElementById('ativosCheckbox').checked;
    var excluidosCheckbox = document.getElementById('excluidosCheckbox').checked;
    var todosCheckbox = document.getElementById('todosCheckbox').checked;

    if (!ativosCheckbox && !excluidosCheckbox && !todosCheckbox) {
        showError("Por favor, selecione ,<strong>uma</strong> opção de filtro.");
        return;
    };

    var filtro = "";
    if (ativosCheckbox) {
        filtro = "Ativos";
    } else if (excluidosCheckbox) {
        filtro = "Excluídos";
    } else if (todosCheckbox) {
        filtro = "Total";
    };

    // Enviar o filtro para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/livros_consultar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filtro: filtro })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                exibirLivros(data.livros);
            } else {
                showError(data.message || "Erro ao consultar cadastro dos livros.");
            };
        })
        .catch(error => {
            showError("Erro ao consultar cadstro dos livros. Tente novamente.");
            console.error('Erro:', error);
        });
};

// ********************************************
// Função para exibição da tabela de livros
// ********************************************
function exibirLivros(livros) {
    var tableBody = document.querySelector('#livrosTable tbody');
    tableBody.innerHTML = '';

    livros.forEach(function (livro) {
        var row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Código do livro:</td><td class='data-cell'>" + livro.codigo_do_livro + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Nome do livro:</td><td class='data-cell'>" + livro.nome_do_livro + "</td>" +
            "<td class='label-cell'>Número do exemplar:</td><td class='data-cell'>" + livro.numero_do_exemplar + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Nome do autor:</td><td class='data-cell'>" + livro.nome_do_autor + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Assuntos do livro:</td><td class='data-cell'>" + livro.assuntos_do_livros + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Nome da editora:</td><td class='data-cell'>" + livro.nome_da_editora + "</td>" +
            "<td class='label-cell'>Número da edição:</td><td class='data-cell'>" + livro.numero_da_edicao + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Local de publicação:</td><td class='data-cell'>" + livro.local_de_publicacao + "</td>" +
            "<td class='label-cell'>Ano de publicação:</td><td class='data-cell'>" + livro.ano_de_publicacao + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Data de inclusão:</td><td class='data-cell'>" + livro.data_de_inclusao + "</td>" +
            "<td class='label-cell'>Data de exclusão:</td><td class='data-cell'>" + livro.data_de_exclusao + "</td>";

        row = tableBody.insertRow();
        row.className = 'empty-row';
        row.innerHTML = "<td colspan='4'>&nbsp;</td>";
    });
};

// ********************************************
// Função para impressão da tabela de livros
// ********************************************
function imprimirTabelaLivros() {
    var tabela = document.getElementById('livrosTable');

    if (tabela) {
        var tabelaClone = tabela.cloneNode(true);
        var janelaImpressao = window.open('', '', 'width=800,height=600');

        janelaImpressao.document.write('<html><head><title>Listagem dos livros</title>')
        janelaImpressao.document.write('</head><body>');
        janelaImpressao.document.write(tabelaClone.outerHTML);
        janelaImpressao.document.write('</body></html>');

        janelaImpressao.document.close();
        janelaImpressao.focus();
        janelaImpressao.print();
        janelaImpressao.close();
    } else {
        showNotice("Tabela não está disponível para impressão.");
    };
};