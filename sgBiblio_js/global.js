// ****************************************************************************************
// Funções globais
// ****************************************************************************************

// ****************************************************************************************
// Função para abrir o modal com a mensagem de sucesso
// ****************************************************************************************
function showSuccess(message) {
    document.querySelector('.modalSuccess-body').innerHTML = message;
    document.querySelector('.modalSuccess').style.display = "block";
};

// ****************************************************************************************
// Função para abrir o modal com a mensagem de notificação
// ****************************************************************************************
function showNotice(message) {
    document.querySelector('.modalNotice-body').innerHTML = message;
    document.querySelector('.modalNotice').style.display = "block";
};

// ****************************************************************************************
// Função para abrir o modal com a mensagem de erro
// ****************************************************************************************
function showError(message) {
    document.querySelector('.modalError-body').innerHTML = message;
    document.querySelector('.modalError').style.display = "block";
};

// ****************************************************************************************
// Funções relativas a verificação de autenticação
// ****************************************************************************************
function verificarAutenticacao() {
    verificarUsuarioLogado()
        .then(papel => {
            if (papel) {
                // Se o usuário estiver logado, você pode carregar a página normalmente
            } else {
                // Caso contrário, abre o modal de autenticação
                openModal('modal_usuario_autenticar');
            }
        })
        .catch(error => {
            // Em caso de erro na verificação, abre o modal de autenticação
            console.error("Erro ao verificar autenticação:", error);
            openModal('modal_usuario_autenticar');
        });
};

// ****************************************************************************************
// Função para verificar usuário logado
// ****************************************************************************************
function verificarUsuarioLogado() {
    return fetch('/sgBiblio/sgBiblio_php/usuarios_verificar_logado.php')
        .then(response => response.json())
        .then(data => {
            if (data.papel) {
                return data.papel;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error('Erro ao verificar usuário logado:', error);
            throw error;
        });
};

// ****************************************************************************************
// Funções relativas aos módulo de autenticação
// ****************************************************************************************
function enviarFormularioUsuarioAutenticar() {
    var loginUsuario = document.getElementById("login_usuario_autenticar").value;
    var senhaUsuario = document.getElementById("senha_usuario_autenticar").value;

    if (!loginUsuario || !senhaUsuario) {
        showError("Por favor, preencha <strong>todos</strong> os campos.");
        return;
    };

    var usuarioAutenticar = {
        login_usuario: loginUsuario,
        senha_usuario: senhaUsuario
    };

    fetch('/sgBiblio/sgBiblio_php/usuarios_autenticar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioAutenticar)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            verificarUsuarioLogado();
            closeModal('modal_usuario_autenticar');
        } else {
            showError("Por favor, verifique o usuário e a senha!");
			document.getElementById("login_usuario_autenticar").value = '';
            document.getElementById("senha_usuario_autenticar").value = '';
        };
    })
    .catch(error => {
        showError("Erro ao autenticar o usuário. Tente novamente.");
        console.error('Erro:', error);
    });
};

// ****************************************************************************************
// Funções para voltar a tela de login
// ****************************************************************************************
function resetModal(modalId) {
    document.getElementById(modalId).style.display = "none";

    if (modalId === 'modal_usuario_autenticar') {
        fetch('/sgBiblio/sgBiblio_php/usuarios_soltar_logado.php', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/sgBiblio/sgBiblio_html/index.html';
            } else {
                console.error('Erro ao liberar o usuário logado: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    };
};

// ****************************************************************************************
// Função para desmarcar as caixas de opção
// ****************************************************************************************
function desmarcarOutras(checkbox) {
    const checkboxes = document.querySelectorAll('input[name="filtro"]');
    checkboxes.forEach((item) => {
        if (item !== checkbox) {
            item.checked = false;
        };
    });
};

// ****************************************************************************************
// Funções para abrir os modais
// ****************************************************************************************
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";

    if (modalId === 'modal_usuario_autenticar') {
        // Código específico para modal_leitores_incluir
    };

    if (modalId === 'modal_leitores_incluir') {
        // Código específico para modal_leitores_incluir
    };

    if (modalId === 'modal_livros_incluir') {
        buscarLivroTombo();
    };

    if (modalId === 'modal_emprestimos_incluir') {
        buscarEmprestimoTombo();
        camposDataEmprestimos();
    };

    if (modalId === 'modal_usuarios_incluir') {
        verificarUsuarioLogado().then(function(usuarioLogado) {
            if (usuarioLogado !== "admin") {
                showError("Essa função é <strong>exclusiva</strong> do administrador do sistema.");
                closeModal('modal_usuarios_incluir');
            };
        }).catch(function(error) {
            console.error("Erro ao verificar o usuário logado:", error);
        });
    };

    if (modalId === 'modal_usuarios_alterar') {
        verificarUsuarioLogado().then(function(usuarioLogado) {
            if (usuarioLogado !== "admin") {
                showNotice("Atualize <strong>as suas</strong> informações.");
                document.getElementById('nome_usuario_alterar').value = usuarioLogado || '';
                document.getElementById('nome_usuario_alterar').style.backgroundColor = 'rgba(173, 216, 230, 0.4)';
                document.getElementById('nome_usuario_alterar').readOnly = true;
                document.getElementById('buscarUsuariosAlterarBotao').disabled = true;
                buscarUsuarioAlterar();
            };
        }).catch(function(error) {
            console.error("Erro ao verificar o usuário logado:", error);
        });
    };

    if (modalId === 'modal_usuarios_excluir') {
        verificarUsuarioLogado().then(function(usuarioLogado) {
            if (usuarioLogado !== "admin") {
                showError("Essa função é <strong>exclusiva</strong> do administrador do sistema.");
                closeModal('modal_usuarios_excluir');
            }
        }).catch(function(error) {
            console.error("Erro ao verificar o usuário logado:", error);
        });
    }

    if (modalId === 'modal_usuarios_consultar') {
        verificarUsuarioLogado().then(function(usuarioLogado) {
            if (usuarioLogado !== "admin") {
                showError("Essa função é <strong>exclusiva</strong> do administrador do sistema.");
                closeModal('modal_usuarios_consultar');
            };
        }).catch(function(error) {
            console.error("Erro ao verificar o usuário logado:", error);
        });
    };
};

// ****************************************************************************************
// Funções para fechar os modais
// ****************************************************************************************
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";

    if (modalId === 'modal_leitores_incluir') {
        var form = document.getElementById("formLeitoresIncluir");
        form.reset();
    };

    if (modalId === 'modal_leitores_alterar') {
        var form = document.getElementById("formLeitoresAlterar");
        form.reset();
    };

    if (modalId === 'modal_leitores_excluir') {
        var form = document.getElementById("formLeitoresExcluir");
        form.reset();
    };

    if (modalId === 'modal_leitores_consultar') {
        document.getElementById('ativosCheckbox').checked = true;
        document.getElementById('excluidosCheckbox').checked = false;
        document.getElementById('todosCheckbox').checked = false;
        var table = document.getElementById('leitoresTable');
        while (table.rows.length > 0) {
            table.deleteRow(0);
        };
    };

    if (modalId === 'modal_livros_incluir') {
        var form = document.getElementById("formLivrosIncluir");
        form.reset();
    };

    if (modalId === 'modal_livros_alterar') {
        var form = document.getElementById("formLivrosAlterar");
        form.reset();
    };

    if (modalId === 'modal_livros_excluir') {
        var form = document.getElementById("formLivrosExcluir");
        form.reset();
    };

    if (modalId === 'modal_livros_consultar') {
        document.getElementById('ativosCheckbox').checked = true;
        document.getElementById('excluidosCheckbox').checked = false;
        document.getElementById('todosCheckbox').checked = false;
        var table = document.getElementById('livrosTable');
        while (table.rows.length > 0) {
            table.deleteRow(0);
        };
    };

    if (modalId === 'modal_emprestimos_incluir') {
        var form = document.getElementById("formEmprestimosIncluir");
        form.reset();
    };

    if (modalId === 'modal_emprestimos_alterar') {
        var form = document.getElementById("formEmprestimosAlterar");
        form.reset();
    };

    if (modalId === 'modal_emprestimos_excluir') {
        var form = document.getElementById("formEmprestimosExcluir");
        form.reset();
    };

    if (modalId === 'modal_emprestimos_consultar') {
        document.getElementById('abertosCheckbox').checked = true;
        document.getElementById('atrasadosCheckbox').checked = false;
        document.getElementById('entreguesCheckbox').checked = false;
        document.getElementById('todosCheckbox').checked = false;
        var table = document.getElementById('emprestimosTable');
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    };

    if (modalId === 'modal_usuario_autenticar') {
        var form = document.getElementById("formUsuarioAutenticar");
        form.reset();
    };

    if (modalId === 'modal_usuarios_incluir') {
        var form = document.getElementById("formUsuariosIncluir");
        form.reset();
    };

    if (modalId === 'modal_usuarios_alterar') {
        var form = document.getElementById("formUsuariosAlterar");
        form.reset();
    };

    if (modalId === 'modal_usuarios_excluir') {
        var form = document.getElementById("formUsuariosExcluir");
        form.reset();
    };

    if (modalId === 'modal_usuarios_consultar') {
        document.getElementById('ativosCheckbox').checked = true;
        document.getElementById('excluidosCheckbox').checked = false;
        document.getElementById('todosCheckbox').checked = false;
        var table = document.getElementById('usuariosTable');
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    }
};

// ****************************************************************************************
// Adicionando as funções no escopo global para que possam ser usadas nos links
// ****************************************************************************************
window.openModal = openModal;
window.closeModal = closeModal;