// ****************************************************************************************
// Funções relativas ao módulo leitores
// ****************************************************************************************

// ********************************************
// Função para o modal_incluir_leitores
// ********************************************
function enviarFormularioIncluirLeitor() {
    var codigoLeitor = document.getElementById("codigo_leitor_incluir").value;
    var nomeLeitor = document.getElementById("nome_leitor_incluir").value;
    var funcaoLeitor = document.getElementById("funcao_leitor_incluir").value;
    var localLeitor = document.getElementById("local_leitor_incluir").value;
    var contatoLeitor = document.getElementById("contato_leitor_incluir").value;

    if (!codigoLeitor || !nomeLeitor || !funcaoLeitor || !localLeitor || !contatoLeitor) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoLeitor <= 0) {
        showError("Digite o código novamente.");
        return;
    };

    var leitorIncluir = {
        codigo_do_leitor: codigoLeitor,
        nome_do_leitor: nomeLeitor,
        funcao_do_leitor: funcaoLeitor,
        local_do_leitor: localLeitor,
        contato_do_leitor: contatoLeitor
    };

    // Enviar os dados para o servidor usando fetch (AJAX)
    fetch('/sgBiblio/sgBiblio_php/leitores_incluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leitorIncluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do leitor realizado com sucesso!");
            closeModal('modal_leitores_incluir');
        } else {
            showError(data.message || "Erro ao cadastrar leitor.");
            var form = document.getElementById("formLeitoresIncluir");
            form.reset();
        };
    })
    .catch(error => {
        showError("Erro ao cadastrar leitor.");
        console.error('Erro ao cadastrar leitor:', error);
    });
};

// ********************************************
// Função para buscar as informações do leitor
// ********************************************
function buscarLeitorAlterar() {
    var form = document.forms['formLeitoresAlterar'];
    var codigo_leitor = form['codigo_leitor_alterar'].value;

    if (!codigo_leitor) {
        showError("Código do leitor não foi digitado.");
        return;
    };

    if (codigo_leitor <= 0) {
        showError("Digite o código novamente.");
		document.getElementById('codigo_leitor_alterar').value = '';
        return;
    };

    // Enviar o código do leitor para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/leitores_alterar_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_leitor: codigo_leitor })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_leitores_alterar').style.display = 'block';

        if (data.success) {
            document.getElementById("codigo_leitor_alterar").value = data.codigo_do_leitor || '';
            document.getElementById("nome_leitor_alterar").value = data.nome_do_leitor || '';
            document.getElementById("funcao_leitor_alterar").value = data.funcao_do_leitor || '';
            document.getElementById("local_leitor_alterar").value = data.local_do_leitor || '';
            document.getElementById("contato_leitor_alterar").value = data.contato_do_leitor || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do leitor.");
            document.getElementById("codigo_leitor_alterar").value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do leitor. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_alterar_leitores
// ********************************************
function enviarFormularioAlterarLeitor() {
    var codigoLeitor = document.getElementById("codigo_leitor_alterar").value;
    var nomeLeitor = document.getElementById("nome_leitor_alterar").value;
    var funcaoLeitor = document.getElementById("funcao_leitor_alterar").value;
    var localLeitor = document.getElementById("local_leitor_alterar").value;
    var contatoLeitor = document.getElementById("contato_leitor_alterar").value;

    if (!codigoLeitor || !nomeLeitor || !funcaoLeitor || !localLeitor || !contatoLeitor) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoLeitor <= 0) {
        showError("Digite o código novamente.");
        return;
    };

    var leitorAlterar = {
        codigo_do_leitor: codigoLeitor,
        nome_do_leitor: nomeLeitor,
        funcao_do_leitor: funcaoLeitor,
        local_do_leitor: localLeitor,
        contato_do_leitor: contatoLeitor
    };

    // Enviar os dados via fetch para o servidor PHP
    fetch('/sgBiblio/sgBiblio_php/leitores_alterar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leitorAlterar)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do leitor alterado com sucesso!");
            closeModal('modal_leitores_alterar');
        } else {
            showError(data.message || "Erro ao alterar cadastro do leitor.");
        };
    })
    .catch(error => {
        showError("Erro ao alterar cadastro do leitor. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para buscar as informações do leitor
// ********************************************
function buscarLeitorExcluir() {
    var form = document.forms['formLeitoresExcluir'];
    var codigo_leitor = form['codigo_leitor_excluir'].value;

    if (!codigo_leitor) {
        showError("Código do leitor não foi digitado.");
        return;
    };

    if (codigo_leitor <= 0) {
        showError("Digite o código novamente.");
        return;
    };

    // Enviar o código do leitor para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/leitores_excluir_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo_do_leitor: codigo_leitor })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_leitores_excluir').style.display = 'block';

        if (data.success) {
            document.getElementById("codigo_leitor_excluir").value = data.codigo_do_leitor || '';
            document.getElementById("nome_leitor_excluir").value = data.nome_do_leitor || '';
            document.getElementById("funcao_leitor_excluir").value = data.funcao_do_leitor || '';
            document.getElementById("local_leitor_excluir").value = data.local_do_leitor || '';
            document.getElementById("contato_leitor_excluir").value = data.contato_do_leitor || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do leitor.");
            document.getElementById("codigo_leitor_excluir").value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do leitor. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_excluir_leitores
// ********************************************
function enviarFormularioExcluirLeitor() {
    var codigoLeitor = document.getElementById("codigo_leitor_excluir").value;
    var nomeLeitor = document.getElementById("nome_leitor_excluir").value;
    var funcaoLeitor = document.getElementById("funcao_leitor_excluir").value;
    var localLeitor = document.getElementById("local_leitor_excluir").value;
    var contatoLeitor = document.getElementById("contato_leitor_excluir").value;

    if (!codigoLeitor || !nomeLeitor || !funcaoLeitor || !localLeitor || !contatoLeitor) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (codigoLeitor <= 0) {
        showError("Digite o código novamente.");
        return;
    };

    var leitorExcluir = {
        codigo_do_leitor: codigoLeitor,
        nome_do_leitor: nomeLeitor,
        funcao_do_leitor: funcaoLeitor,
        local_do_leitor: localLeitor,
        contato_do_leitor: contatoLeitor
    };

    // Enviar o código do leitor a ser excluído para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/leitores_excluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leitorExcluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do leitor excluído com sucesso!");
            closeModal('modal_leitores_excluir');
        } else {
            showError(data.message || "Erro ao excluir cadastro do leitor.");
        };
    })
    .catch(error => {
        showError("Erro ao excluir cadastro do leitor. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_consultar_leitores
// ********************************************
function pesquisarLeitores() {
    var ativosCheckbox = document.getElementById('ativosCheckbox').checked;
    var excluidosCheckbox = document.getElementById('excluidosCheckbox').checked;
    var todosCheckbox = document.getElementById('todosCheckbox').checked;

    if (!ativosCheckbox && !excluidosCheckbox && !todosCheckbox) {
        showError("Por favor, selecione <strong>uma</strong> opção de filtro.");
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
    fetch('/sgBiblio/sgBiblio_php/leitores_consultar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filtro: filtro })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            exibirLeitores(data.leitores);
        } else {
            showError(data.message || "Erro ao consultar cadastro dos leitores.");
        };
    })
    .catch(error => {
        showError("Erro ao consultar cadastro dos leitores. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para exibição da tabela de leitores
// ********************************************
function exibirLeitores(leitores) {
    var tableBody = document.querySelector('#leitoresTable tbody');
    tableBody.innerHTML = '';

    leitores.forEach(function(leitor) {
        var row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Código do leitor:</td><td class='data-cell'>" + leitor.codigo_do_leitor + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Nome do leitor:</td><td class='data-cell'>" + leitor.nome_do_leitor + "</td>" +
            "<td class='label-cell'>Contato:</td><td class='data-cell'>" + leitor.contato_do_leitor + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Função do leitor:</td><td class='data-cell'>" + leitor.funcao_do_leitor + "</td>" +
            "<td class='label-cell'>Local do leitor:</td><td class='data-cell'>" + leitor.local_do_leitor + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Data de inclusão:</td><td class='data-cell'>" + leitor.data_de_inclusao + "</td>" +
            "<td class='label-cell'>Data de exclusão:</td><td class='data-cell'>" + leitor.data_de_exclusao + "</td>";

        row = tableBody.insertRow();
        row.className = 'empty-row';
        row.innerHTML = "<td colspan='4'>&nbsp;</td>";
    });
};

// ********************************************
// Função para impressão da tabela de leitores
// ********************************************
function imprimirTabelaLeitores() {
    var tabela = document.getElementById('leitoresTable');
	
    if (tabela) {
        var tabelaClone = tabela.cloneNode(true);
        var janelaImpressao = window.open('', '', 'width=800,height=600');

        janelaImpressao.document.write('<html><head><title>Listagem dos leitores</title>')
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