document.addEventListener('DOMContentLoaded', function() {
    // as constantes que tão puxando do id dos html.
    const btnSair = document.getElementById('btnSair');
    const modalRequerimento = document.getElementById('modalRequerimento');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnEncaminhar = document.getElementById('btnEncaminhar');

    // Pega o nome do aluno salvo quando fez login
    const nomeAluno = localStorage.getItem('nomeAluno');
    if (nomeAluno) {
        const elementoNome = document.getElementById('nomeUsuario');
        if (elementoNome) {
            elementoNome.textContent = nomeAluno;
        }
        // Se quiser mudar também o "Aluno" para o nome, descomente:
        // const tipoUsuario = document.getElementById('tipo-usuario');
        // if (tipoUsuario) tipoUsuario.textContent = nomeAluno.split(' ')[0];
    }

    function fecharModal() {
        if (modalRequerimento) {
            modalRequerimento.style.display = 'none';
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            if (mensagemSucesso) mensagemSucesso.style.display = 'none';
            const form = document.getElementById('formRequerimento');
            if (form) form.reset();
        }
    }

    // botão de sair que é padrão pra todos, então só chamar ele que tá safe
    if (btnSair) {
        btnSair.addEventListener('click', function() {
            // Limpa o nome ao sair (opcional)
            localStorage.removeItem('nomeAluno');
            window.location.href = 'index.html';
        });
    }

    // Aqui tá a maioria das coisas lá do modal, também deixei as constantes fixas aqui pra ter um controle melhor e porque o modal específico de abrir um requerimento, é só do acesso do aluno, então não tinha a necessidade de pôr em outro canto.
    if (modalRequerimento) {
        const btnNovoRequerimento = document.getElementById('btnNovoRequerimento');
        const btnCancelar = document.getElementById('btnCancelar');
        const btnEnviarAluno = document.getElementById('btnEnviar');

        if (btnNovoRequerimento) {
            btnNovoRequerimento.addEventListener('click', function() {
                modalRequerimento.style.display = 'block';
            });
        }

        if (btnCancelar) {
            btnCancelar.addEventListener('click', fecharModal);
        }

        if (btnEnviarAluno) {
            btnEnviarAluno.addEventListener('click', function() {
                const form = document.getElementById('formRequerimento');
                if (form.checkValidity()) {
                    const mensagemSucesso = document.getElementById('mensagemSucesso');
                    if (mensagemSucesso) mensagemSucesso.style.display = 'block';
                    setTimeout(fecharModal, 2000);
                } else {
                    form.reportValidity();
                }
            });
        }

        window.addEventListener('click', function(event) {
            if (event.target === modalRequerimento) {
                fecharModal();
            }
        });
    }

    // aquela barra lá na página da secretaria
    // ainda falta adicionar a lógica das áreas específicas, mas dá pra reaproveitar.
    if (seletorOpcoes && btnEncaminhar) {
        seletorOpcoes.addEventListener('change', function() {
            console.log('Opção selecionada:', this.value);
        });

        btnEncaminhar.addEventListener('click', function() {
            if (!seletorOpcoes.value) {
                alert('Por favor, selecione uma opção para encaminhar.');
                return;
            }
            alert(`Processo encaminhado para: ${seletorOpcoes.value.toUpperCase()}`);
        });
    }
});