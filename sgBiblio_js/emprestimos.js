// ****************************************************************************************
// Funções relativas aos módulo empréstimo
// ****************************************************************************************

// ********************************************
// Função para buscar o próximo tombo do emprestimo
// ********************************************
function buscarEmprestimoTombo() {
    let ultimo_codigo = 0;

    // Consulta o banco de dados
    fetch('/sgBiblio/sgBiblio_php/emprestimos_tombo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_emprestimos_incluir').style.display = 'block';

        if (data.success) {
            document.getElementById("codigo_emprestimo_incluir").value = data.ultimo_codigo;
        } else {
            showError(data.message || "Erro ao buscar o tombo do emprestimo.");
            document.getElementById("codigo_emprestimo_incluir").value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar o tombo do emprestimo. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_incluir_emprestimo
// ********************************************
function enviarFormularioIncluirEmprestimo() {
    var codigoEmprestimo = document.getElementById("codigo_emprestimo_incluir").value;
    var codigoLivro = document.getElementById("codigo_livro_emprestimo_incluir").value;
    var nomeLivro = document.getElementById("nome_livro_emprestimo_incluir").value;
    var codigoLeitor = document.getElementById("codigo_leitor_emprestimo_incluir").value;
    var nomeLeitor = document.getElementById("nome_leitor_emprestimo_incluir").value;
    var dataRetirada = document.getElementById("data_retirada_incluir").value;
    var dataDevolucao = document.getElementById("data_devolucao_incluir").value;

    if (!codigoEmprestimo || !codigoLivro || !nomeLivro || !codigoLeitor || !nomeLeitor || !dataRetirada || !dataDevolucao) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoEmprestimo <= "0") {
        showError("Digite o código novamente.");
        return;
    };

    var emprestimoIncluir = {
        codigo_do_emprestimo: codigoEmprestimo,
        codigo_do_livro: codigoLivro,
        nome_do_livro: nomeLivro,
        codigo_do_leitor: codigoLeitor,
        nome_do_leitor: nomeLeitor,
        data_de_retirada: dataRetirada,
        data_de_devolucao: dataDevolucao
    };

    // Enviar os dados para o servidor usando fetch (AJAX)
    fetch('/sgBiblio/sgBiblio_php/emprestimos_incluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emprestimoIncluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Empréstimo cadastrado com sucesso!");
            closeModal('modal_emprestimos_incluir');
        } else {
            showError(data.message || "Erro ao cadastrar empréstimo.");
            var form = document.getElementById("formEmprestimosIncluir");
			document.getElementById("codigo_emprestimo_incluir").value = codigoEmprestimo;
			document.getElementById("data_retirada_incluir").value = dataRetirada;
			document.getElementById("data_devolucao_incluir").value = dataDevolucao;
        };
    })
    .catch(error => {
        showError("Erro ao cadastrar empréstimo.");
        console.error('Erro ao cadastrar empréstimo:', error);
    });
};

// ********************************************
// Função para buscar o nome do livro
// ********************************************
function pesquisarLivroEmprestimoIncluir() {
    var form = document.forms['formEmprestimosIncluir'];
    var codigoLivro = form['codigo_livro_emprestimo_incluir'].value;

	if (!codigoLivro) {
        showError("Código do livro não foi digitado.");
        return;
    };

    if (codigoLivro <= "0") {
        showError("Digite o código novamente.");
        document.getElementById('codigo_livro_emprestimo_incluir').value = '';
        return;
    };

	// Enviar o código do livro para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/livros_alterar_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_livro: codigoLivro })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_emprestimos_incluir').style.display = 'block';

        if (data.success) {
        document.getElementById("nome_livro_emprestimo_incluir").value = data.nome_do_livro || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do livro.");
            document.getElementById('codigo_livro_emprestimo_incluir').value = '';
            document.getElementById('nome_livro_emprestimo_incluir').value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do livro. Tente novamente.");
		document.getElementById('codigo_livro_emprestimo_incluir').value = '';
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para buscar o nome do leitor
// ********************************************
function pesquisarLeitorEmprestimoIncluir() {
    var form = document.forms['formEmprestimosIncluir'];
    var codigoLeitor = form['codigo_leitor_emprestimo_incluir'].value;

	if (!codigoLeitor) {
        showError("Código do leitor não foi digitado.");
        return;
    };

    if (codigoLeitor <= "0") {
        showError("Digite o código novamente.");
        document.getElementById('codigo_leitor_emprestimo_incluir').value = '';
        return;
    };

	// Enviar o código do livro para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/leitores_alterar_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_leitor: codigoLeitor })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_emprestimos_incluir').style.display = 'block';

        if (data.success) {
            document.getElementById("nome_leitor_emprestimo_incluir").value = data.nome_do_leitor || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do leitor.");
            document.getElementById('codigo_leitor_emprestimo_incluir').value = '';
            document.getElementById('nome_leitor_emprestimo_incluir').value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do leitor. Tente novamente.");
		document.getElementById('codigo_leitor_emprestimo_incluir').value = '';
        console.error('Erro:', error);
    });
};


// ********************************************
// Função para a data retirada e devolução
// ********************************************
function camposDataEmprestimos() {
    var retirada = new Date();
    var retiradaISO = retirada.toISOString().split('T')[0];
    var devolucao = new Date();
    devolucao.setDate(retirada.getDate() + 7);
    var devolucaoISO = devolucao.toISOString().split('T')[0];
    document.getElementById('data_retirada_incluir').value = retiradaISO;
    document.getElementById('data_devolucao_incluir').value = devolucaoISO;
};

// ***********************************************
// Função para buscar as informações do empréstimo
// ***********************************************
function buscarEmprestimoAlterar() {
    var form = document.forms['formEmprestimosAlterar'];
    var codigo_emprestimo = form['codigo_emprestimo_alterar'].value;

    if (!codigo_emprestimo) {
        showError("Código do empréstimo não foi digitado.");
        return;
    };

    if (codigo_emprestimo <= "0") {
		showError("Digite o código novamente.");
		document.getElementById('codigo_emprestimo_alterar').value = '';
        return;
    };

    // Enviar o código do empréstimo para o servidor usando fetch (AJAX)
    fetch('/sgBiblio/sgBiblio_php/emprestimos_alterar_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_emprestimo: codigo_emprestimo })
    })
    .then(response => response.json())
    .then(data => {
		document.getElementById('modal_emprestimos_alterar').style.display = 'block';
		
        if (data.success) {
            document.getElementById('codigo_emprestimo_alterar').value = data.codigo_do_emprestimo || '';
            document.getElementById('codigo_livro_emprestimo_alterar').value = data.codigo_do_livro || '';
            document.getElementById('nome_livro_emprestimo_alterar').value = data.nome_do_livro || '';
            document.getElementById('codigo_leitor_emprestimo_alterar').value = data.codigo_do_leitor || '';
            document.getElementById('nome_leitor_emprestimo_alterar').value = data.nome_do_leitor || '';
			
			    // Função para converter a data para o formato YYYY-MM-DD
                function formataData(dateString) {
                    const parte = dateString.split(' - ');
                    if (parte.length !== 2) return '';

                    const parteAno = parte[1];
                    const [dia, mes, ano] = parteAno.split('/');
                    return `${ano}-${mes}-${dia}`;Ano
                };

            document.getElementById('data_retirada_alterar').value = formataData(data.data_de_retirada) || '';
            document.getElementById('data_devolucao_alterar').value = formataData (data.data_de_devolucao) || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do empréstimo.");
            document.getElementById('formEmprestimosAlterar').reset();
        }
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do empréstimo. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_alterar_emprestimos
// ********************************************
function enviarFormularioAlterarEmprestimo() {
    var codigoEmprestimo = document.getElementById("codigo_emprestimo_alterar").value;
    var codigoLivro = document.getElementById("codigo_livro_emprestimo_alterar").value;
    var nomeLivro = document.getElementById("nome_livro_emprestimo_alterar").value;
    var codigoLeitor = document.getElementById("codigo_leitor_emprestimo_alterar").value;
    var nomeLeitor = document.getElementById("nome_leitor_emprestimo_alterar").value;
    var dataRetirada = document.getElementById("data_retirada_alterar").value;
    var dataDevolucao = document.getElementById("data_devolucao_alterar").value;

    if (!codigoEmprestimo || !codigoLivro || !nomeLivro || !codigoLeitor || !nomeLeitor || !dataRetirada || !dataDevolucao) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return
    };

    if (codigoEmprestimo <= "0") {
        showError("Digite o código novamente.");
        document.getElementById('codigo_emprestimo_alterar').value = '';
        return;
    };

    var emprestimoAlterar = {
        codigo_do_emprestimo: codigoEmprestimo,
        codigo_do_livro: codigoLivro,
        nome_do_livro: nomeLivro,
        codigo_do_leitor: codigoLeitor,
        nome_do_leitor: nomeLeitor,
        data_de_retirada: dataRetirada,
        data_de_devolucao: dataDevolucao
    };

    // Enviar os dados via fetch para o servidor PHP
    fetch('/sgBiblio/sgBiblio_php/emprestimos_alterar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emprestimoAlterar)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Renovação do empréstimo realizada com sucesso!");
            closeModal('modal_emprestimos_alterar');
        } else {
            showError(data.message || "Erro ao renovar o empréstimo.");
        }
    })
    .catch(error => {
        showError("Erro ao renovar o empréstimo. Tente novamente.");
        console.error('Erro:', error);
    });
};
  
  
// ***********************************************
// Função para buscar as informações do empréstimo
// ***********************************************
function buscarEmprestimoExcluir() {
    var form = document.forms['formEmprestimosExcluir'];
    var codigo_emprestimo = form['codigo_emprestimo_excluir'].value;

    if (!codigo_emprestimo) {
        showError("Código do empréstimo não foi digitado.");
        return;
    };

    if (codigo_emprestimo <= "0") {
		showError("Digite o código novamente.");
		document.getElementById('codigo_emprestimo_excluir').value = '';
        return;
    };

    // Enviar o código do empréstimo para o servidor usando fetch (AJAX)
    fetch('/sgBiblio/sgBiblio_php/emprestimos_excluir_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_emprestimo: codigo_emprestimo })
    })
    .then(response => response.json())
    .then(data => {
		document.getElementById('modal_emprestimos_excluir').style.display = 'block';
		
        if (data.success) {
            document.getElementById('codigo_emprestimo_excluir').value = data.codigo_do_emprestimo || '';
            document.getElementById('codigo_livro_emprestimo_excluir').value = data.codigo_do_livro || '';
            document.getElementById('nome_livro_emprestimo_excluir').value = data.nome_do_livro || '';
            document.getElementById('codigo_leitor_emprestimo_excluir').value = data.codigo_do_leitor || '';
            document.getElementById('nome_leitor_emprestimo_excluir').value = data.nome_do_leitor || '';
			
			    // Função para converter a data para o formato YYYY-MM-DD
                function formataData(dateString) {
                    const parte = dateString.split(' - ');
                    if (parte.length !== 2) return ''; // Retorna string vazia se não for o formato esperado

                    const parteAno = parte[1];
                    const [dia, mes, ano] = parteAno.split('/');
                    return `${ano}-${mes}-${dia}`;Ano
                };

            document.getElementById('data_retirada_excluir').value = formataData(data.data_de_retirada) || '';
            document.getElementById('data_devolucao_excluir').value = formataData (data.data_de_devolucao) || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do empréstimo.");
            document.getElementById('formEmprestimosExcluir').reset();
        }
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do empréstimo. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_excluir_emprestimos
// ********************************************
function enviarFormularioExcluirEmprestimo() {
    var codigoEmprestimo = document.getElementById("codigo_emprestimo_excluir").value;
    var codigoLivro = document.getElementById("codigo_livro_emprestimo_excluir").value;
    var nomeLivro = document.getElementById("nome_livro_emprestimo_excluir").value;
    var codigoLeitor = document.getElementById("codigo_leitor_emprestimo_excluir").value;
    var nomeLeitor = document.getElementById("nome_leitor_emprestimo_excluir").value;
    var dataRetirada = document.getElementById("data_retirada_excluir").value;
    var dataDevolucao = document.getElementById("data_devolucao_excluir").value;

    if (!codigoEmprestimo || !codigoLivro || !nomeLivro || !codigoLeitor || !nomeLeitor || !dataRetirada || !dataDevolucao) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return
    };

    if (codigoEmprestimo <= "0") {
        showError("Digite o código novamente.");
        document.getElementById('codigo_emprestimo_excluir').value = '';
        return;
    };

    var emprestimoExcluir = {
        codigo_do_emprestimo: codigoEmprestimo,
        codigo_do_livro: codigoLivro,
        nome_do_livro: nomeLivro,
        codigo_do_leitor: codigoLeitor,
        nome_do_leitor: nomeLeitor,
        data_de_retirada: dataRetirada,
        data_de_devolucao: dataDevolucao
    };

    // Enviar os dados via fetch para o servidor PHP
    fetch('/sgBiblio/sgBiblio_php/emprestimos_excluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emprestimoExcluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Devolução do empréstimo realizada com sucesso!");
            closeModal('modal_emprestimos_excluir');
        } else {
            showError(data.message || "Erro ao devolver o empréstimo.");
        }
    })
    .catch(error => {
        showError("Erro ao devolver o empréstimo. Tente novamente.");
        console.error('Erro:', error);
    });
};


// ********************************************
// Função para o modal_consultar_emprestimos
// ********************************************
function pesquisarEmprestimos() {
    var abertosCheckbox = document.getElementById('abertosCheckbox').checked;
    var atrasadosCheckbox = document.getElementById('atrasadosCheckbox').checked;
    var entreguesCheckbox = document.getElementById('entreguesCheckbox').checked;
    var todosCheckbox = document.getElementById('todosCheckbox').checked;

    if (!abertosCheckbox && !atrasadosCheckbox && !entreguesCheckbox && !todosCheckbox) {
        showError("Por favor, selecione ,<strong>uma</strong> opção de filtro.");
        return;
    };

    var filtro = "";
    if (abertosCheckbox) {
        filtro = "Abertos";
    } else if (atrasadosCheckbox) {
        filtro = "Atrasados";  
    } else if (entreguesCheckbox) {
        filtro = "Entregues";
    } else if (todosCheckbox) {
        filtro = "Total";
    };

    // Enviar o filtro para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/emprestimos_consultar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filtro: filtro })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                exibirEmprestimos(data.emprestimos);
            } else {
                showError(data.message || "Erro ao buscar cadastro dos empréstimos.");
            }
        })
        .catch(error => {
            showError("Erro ao buscar cadastro dos empréstimos. Tente novamente.");
            console.error('Erro:', error);
        });
};  

// *********************************************
// Função para exibição da tabela de empréstimo
// *********************************************
function exibirEmprestimos(emprestimos) {
    var tableBody = document.querySelector('#emprestimosTable tbody');
    tableBody.innerHTML = '';

    emprestimos.forEach(function(emprestimo) {
        var row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Código do empréstimo:</td><td class='data-cell'>" + emprestimo.codigo_do_emprestimo + "</td>";

        row = tableBody.insertRow();row.innerHTML = "<td class='label-cell'>Código do livro:</td><td class='data-cell'>" + emprestimo.codigo_do_livro + "</td>" +
            "<td class='label-cell'>Nome do livro:</td><td class='data-cell'>" + emprestimo.nome_do_livro + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Código do leitor:</td><td class='data-cell'>" + emprestimo.codigo_do_leitor + "</td>" +
            "<td class='label-cell'>Nome do leitor:</td><td class='data-cell'>" + emprestimo.nome_do_leitor + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Data de empréstimo:</td><td class='data-cell'>" + emprestimo.data_de_retirada + "</td>" +
            "<td class='label-cell'>Data de devolução:</td><td class='data-cell'>" + emprestimo.data_de_devolucao + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Data de entrega:</td><td class='data-cell'>" + emprestimo.data_de_entrega + "</td>";

        row = tableBody.insertRow();
        row.className = 'empty-row';
        row.innerHTML = "<td colspan='4'>&nbsp;</td>";
    });
 };

// *********************************************
// Função para impressão da tabela de empréstimo
// *********************************************
function imprimirTabelaEmprestimos() {
    var tabela = document.getElementById('emprestimosTable');

    if (tabela) {
        var tabelaClone = tabela.cloneNode(true);
        var janelaImpressao = window.open('', '', 'width=800,height=600');

        janelaImpressao.document.write('<html><head><title>Listagem dos empréstimos</title>')
        janelaImpressao.document.write('</head><body>');
        janelaImpressao.document.write(tabelaClone.outerHTML);
        janelaImpressao.document.write('</body></html>');

        janelaImpressao.document.close();
        janelaImpressao.focus();
        janelaImpressao.print();
        janelaImpressao.close();
    } else {
        showNotice("Tabela não está disponível para impressão.");
    }
 };