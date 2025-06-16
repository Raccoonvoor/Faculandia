document.addEventListener('DOMContentLoaded', function() {
    const btnSair = document.getElementById('btnSair');
    const modalRequerimento = document.getElementById('modalRequerimento');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnEncaminhar = document.getElementById('btnEncaminhar');

    // Pega o nome do usuário salvo no login.
    const nomeAluno = localStorage.getItem('nomeAluno');
    if (nomeAluno) {
        const elementoNome = document.querySelector('.user-name');
        if (elementoNome) {
            elementoNome.textContent = nomeAluno;
        }
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

    // Botão Sair - Corrigido com caminho absoluto e verificação.
    if (btnSair) {
        btnSair.addEventListener('click', function() {
            localStorage.removeItem('nomeAluno');
            window.location.href = '../HTML/index.html';
            
            // Debug (Pode remover isso daqui se precisar Thiago).
            console.log('Botão sair clicado - redirecionando...');
        });
    }

    // Controle do modal de requerimentos.
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

    // Lógica da secretaria.
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