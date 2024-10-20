// ****************************************************************************************
// Funções relativas ao módulo usuários
// ****************************************************************************************

// ********************************************
// Função para o modal_incluir_usuarios
// ********************************************
function enviarFormularioIncluirUsuario() {
    var nomeUsuario = document.getElementById("nome_usuario_incluir").value;
    var contatoUsuario = document.getElementById("contato_usuario_incluir").value;
    var loginUsuario = document.getElementById("login_usuario_incluir").value;
    var senhaUsuario = document.getElementById("senha1_usuario_incluir").value;
    var senhaConfUsuario = document.getElementById("senha2_usuario_incluir").value;

    if (!nomeUsuario || !contatoUsuario || !loginUsuario || !senhaUsuario || !senhaConfUsuario) {
        showError("Todos os campos devem ser preenchidos.");
        return;
    };

    var regexNumero = /[0-9]/;
    if (!regexNumero.test(senhaUsuario)) {
        showError("A senha deve conter pelo menos um número. Digite outra senha.");
        return;
    };

    var regexCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/;
    if (!regexCaractereEspecial.test(senhaUsuario)) {
        showError("A senha deve conter pelo menos um caractere especial. Digite outra senha.");
        return;
    };

    if (senhaUsuario === nomeUsuario) {
        showError("As senhas não podem ser iguais ao nome do usuário! Digite outra senha.");
        return;
    };

    if (senhaUsuario !== senhaConfUsuario) {
        showError("As senhas não coincidem! Por favor, digite novamente.");
        return;
    };

    var usuarioIncluir = {
        nome_do_usuario: nomeUsuario,
        contato_do_usuario: contatoUsuario,
        login_do_usuario: loginUsuario,
        senha_do_usuario: senhaUsuario
    };

    // Enviar os dados para o servidor usando fetch (AJAX)
    fetch('/sgBiblio/sgBiblio_php/usuarios_incluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioIncluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do usuário incluído com sucesso!");
            closeModal('modal_usuarios_incluir');
        } else {
            showError(data.message || "Erro ao incluir cadastro do usuário.");
            var form = document.getElementById("formUsuariosIncluir");
            form.reset();
        }
    })
    .catch(error => {
        showError("Erro ao incluir cadastro do usuário. Tente novamente.");
        console.error('Erro ao incluir cadastro do usuário:', error);
    });
};

// ********************************************
// Função para buscar as informações do usuário
// ********************************************
function buscarUsuarioAlterar() {
    var form = document.forms['formUsuariosAlterar'];
    var nome_usuario = form['nome_usuario_alterar'].value;

    if (!nome_usuario) {
        showError("Nome do usuário não foi digitado.");
        return;
    };

    // Enviar o nome do usuário para o PHP usando fetch
    fetch('/sgBiblio/sgBiblio_php/usuarios_alterar_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_do_usuario: nome_usuario })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_usuarios_alterar').style.display = 'block';

        if (data.success) {
            document.getElementById('contato_usuario_alterar').value = data.contato_do_usuario || '';
            document.getElementById('login_usuario_alterar').value = data.login_do_usuario || '';
            document.getElementById('senha1_usuario_alterar').value = data.senha_do_usuario || '';
            document.getElementById('senha2_usuario_alterar').value = data.senha_do_usuario || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do usuário.");
            document.getElementById('nome_usuario_alterar').value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do usuário. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_alterar_usuarios
// ********************************************
function enviarFormularioAlterarUsuario() {
    var nomeUsuario = document.getElementById('nome_usuario_alterar').value;
    var contatoUsuario = document.getElementById('contato_usuario_alterar').value;
    var loginUsuario = document.getElementById('login_usuario_alterar').value;
    var senhaUsuario = document.getElementById('senha1_usuario_alterar').value;
    var senhaConfUsuario = document.getElementById('senha2_usuario_alterar').value;

    if (!nomeUsuario || !contatoUsuario || !loginUsuario || !senhaUsuario || !senhaConfUsuario) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    if (senhaUsuario !== senhaConfUsuario) {
        showNotice("As senhas não coincidem. Por favor, verifique e digite novamente.");
        return;
    };

    var usuarioAlterar = {
        nome_do_usuario: nomeUsuario,
        contato_do_usuario: contatoUsuario,
        login_do_usuario: loginUsuario,
        senha_do_usuario: senhaUsuario
    };

    // Enviar os dados para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/usuarios_alterar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioAlterar)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do usuário alterado com sucesso!");
            closeModal('modal_usuarios_alterar');
        } else {
            showError(data.message || "Erro ao alterar cadastro do usuário.");
        };
    })
    .catch(error => {
        showError("Erro ao alterar cadastro do usuário. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para buscar as informações do usuário
// ********************************************
function buscarUsuarioExcluir() {
    var form = document.forms['formUsuariosExcluir'];
    var nome_usuario = form['nome_usuario_excluir'].value;

    if (!nome_usuario) {
        showError("Nome do usuário não foi digitado.");
        return;
    };

    // Enviar o nome do usuário para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/usuarios_excluir_buscar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_do_usuario: nome_usuario })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modal_usuarios_excluir').style.display = 'block';

        if (data.success) {
            document.getElementById("contato_usuario_excluir").value = data.contato_do_usuario || '';
            document.getElementById("login_usuario_excluir").value = data.login_do_usuario || '';
            document.getElementById("senha1_usuario_excluir").value = data.senha_do_usuario || '';
            document.getElementById("senha2_usuario_excluir").value = data.senha_do_usuario || '';
        } else {
            showError(data.message || "Erro ao buscar cadastro do usuário.");
            document.getElementById("nome_usuario_excluir").value = '';
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro do usuário. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_excluir_usuarios
// ********************************************
function enviarFormularioExcluirUsuario() {
    var nomeUsuario = document.getElementById("nome_usuario_excluir").value;
    var contatoUsuario = document.getElementById("contato_usuario_excluir").value;
    var loginUsuario = document.getElementById("login_usuario_excluir").value;
    var senhaUsuario = document.getElementById("senha1_usuario_excluir").value;
    var senhaConfUsuario = document.getElementById("senha2_usuario_excluir").value;

    if (!nomeUsuario || !contatoUsuario || !loginUsuario || !senhaUsuario || !senhaConfUsuario) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    var usuarioExcluir = {
        nome_do_usuario: nomeUsuario,
        contato_do_usuario: contatoUsuario,
        login_do_usuario: loginUsuario,
        senha_do_usuario: senhaUsuario
    };

    // Enviar o usuário a ser excluído para o PHP via fetch
    fetch('/sgBiblio/sgBiblio_php/usuarios_excluir.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioExcluir)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess("Cadastro do usuário excluído com sucesso!");
            closeModal('modal_usuarios_excluir');
        } else {
            showError(data.message || "Erro ao excluir cadastro do usuário.");
        };
    })
    .catch(error => {
        showError("Erro ao excluir cadastro do usuário. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para o modal_consultar_usuarios
// ********************************************
function pesquisarUsuarios() {
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
    fetch('/sgBiblio/sgBiblio_php/usuarios_consultar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filtro: filtro })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            exibirUsuarios(data.usuarios);
        } else {
            showError(data.message || "Erro ao buscar cadastro dos usuários.");
        };
    })
    .catch(error => {
        showError("Erro ao buscar cadastro dos usuários. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ********************************************
// Função para exibição da tabela de usuários
// ********************************************
function exibirUsuarios(usuarios) {
    var tableBody = document.querySelector('#usuariosTable tbody');
    tableBody.innerHTML = '';

    usuarios.forEach(function(usuario) {
        var row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Nome do usuário:</td><td class='data-cell'>" + usuario.nome_do_usuario + "</td>" +
            "<td class='label-cell'>Contato do usuário:</td><td class='data-cell'>" + usuario.contato_do_usuario + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Login do usuário:</td><td class='data-cell'>" + usuario.login_do_usuario + "</td>";

        row = tableBody.insertRow();
        row.innerHTML = "<td class='label-cell'>Data de inclusão:</td><td class='data-cell'>" + usuario.data_de_inclusao + "</td>" +
            "<td class='label-cell'>Data de exclusão:</td><td class='data-cell'>" + usuario.data_de_exclusao + "</td>";

        row = tableBody.insertRow();
        row.className = 'empty-row';
        row.innerHTML = "<td colspan='4'>&nbsp;</td>";
    });
};

// ********************************************
// Função para impressão da tabela de usuários
// ********************************************
function imprimirTabelaUsuarios() {
    var tabela = document.getElementById('usuariosTable');

    if (tabela) {
        var tabelaClone = tabela.cloneNode(true);
        var janelaImpressao = window.open('', '', 'width=800,height=600');

        janelaImpressao.document.write('<html><head><title>Listagem dos usuários</title>');
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