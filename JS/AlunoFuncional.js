document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const nomeUsuario = localStorage.getItem('nomeAluno');
    const btnSair = document.getElementById('btnSair');
    const btnNovoRequerimento = document.getElementById('btnNovoRequerimento');
    const novoRequerimentoSection = document.getElementById('novoRequerimentoSection');
    const btnCancelarRequerimento = document.getElementById('btnCancelarRequerimento');
    const btnEnviarRequerimento = document.getElementById('btnEnviarRequerimento');
    const textoNovoRequerimento = document.getElementById('textoNovoRequerimento');
    const descricaoConteudo = document.getElementById('descricaoConteudo');
    const statusBox = document.getElementById('statusBox');
    const btnEditarRequerimento = document.getElementById('btnEditarRequerimento');
    const modalEdicao = document.getElementById('modalEdicao');
    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
    const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
    const textoRequerimentoEditado = document.getElementById('textoRequerimentoEditado');

    // Exibir nome do usuário
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Botão Sair
    btnSair.addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        window.location.href = '../HTML/index.html';
    });

    // Novo Requerimento
    btnNovoRequerimento.addEventListener('click', function() {
        novoRequerimentoSection.style.display = 'block';
        textoNovoRequerimento.value = '';
        textoNovoRequerimento.focus();
        novoRequerimentoSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Cancelar novo requerimento
    btnCancelarRequerimento.addEventListener('click', function() {
        novoRequerimentoSection.style.display = 'none';
    });

    // Enviar novo requerimento
    btnEnviarRequerimento.addEventListener('click', function() {
        const texto = textoNovoRequerimento.value.trim();
        
        if (!texto) {
            alert('Por favor, escreva seu requerimento antes de enviar.');
            return;
        }

        enviarRequerimento(texto);
    });

    // Função para enviar requerimento para a secretaria
    function enviarRequerimentoParaSecretaria(texto, nomeAluno, matricula) {
        const requerimento = {
            id: Date.now(), // ID único baseado no timestamp
            conteudo: texto,
            aluno: nomeAluno,
            matricula: matricula,
            data: new Date().toISOString(),
            status: 'enviado',
            historico: [
                {
                    acao: 'enviado',
                    data: new Date().toISOString(),
                    por: nomeAluno
                }
            ]
        };
        
        // Armazenar no localStorage (simulando banco de dados)
        let requerimentos = JSON.parse(localStorage.getItem('requerimentos')) || [];
        requerimentos.push(requerimento);
        localStorage.setItem('requerimentos', JSON.stringify(requerimentos));
        
        return requerimento;
    }

    // Função para enviar requerimento
    function enviarRequerimento(texto) {
        btnEnviarRequerimento.disabled = true;
        btnEnviarRequerimento.textContent = 'Enviando...';
        
        const nomeAluno = localStorage.getItem('nomeAluno');
        const matricula = localStorage.getItem('matriculaAluno');
        
        // Envia para a secretaria
        const requerimento = enviarRequerimentoParaSecretaria(texto, nomeAluno, matricula);
        
        // Atualiza a visualização
        const paragrafos = texto.split('\n').filter(p => p.trim() !== '');
        descricaoConteudo.innerHTML = paragrafos.map(p => `<p>${p}</p>`).join('');
        
        // Atualiza o status
        statusBox.innerHTML = `
            <h3>STATUS</h3>
            <div class="status-item status-enviado">ENVIADO</div>
            <div class="status-item status-pendente">AGUARDANDO ANÁLISE</div>
            <div class="status-info">Protocolo: ${requerimento.id}</div>
        `;
        
        // Limpa e esconde o editor
        textoNovoRequerimento.value = '';
        novoRequerimentoSection.style.display = 'none';
        
        // Reativa o botão
        btnEnviarRequerimento.disabled = false;
        btnEnviarRequerimento.textContent = 'Enviar Requerimento';
        
        // Atualiza o botão de edição
        btnEditarRequerimento.style.display = 'block';
        
        // Feedback ao usuário
        alert(`Requerimento enviado com sucesso! Protocolo: ${requerimento.id}`);
    }

    // Função para ajustar o textarea no modal
    function ajustarTextareaModal() {
        const textarea = textoRequerimentoEditado;
        const modalContent = document.querySelector('.modal-conteudo');
        
        // Calcula a altura máxima disponível
        const espacoDisponivel = window.innerHeight - 200;
        textarea.style.maxHeight = espacoDisponivel + 'px';
        modalContent.style.maxHeight = (espacoDisponivel + 100) + 'px';
    }

    // Editar Requerimento
    btnEditarRequerimento.addEventListener('click', function() {
        const textoAtual = descricaoConteudo.innerText;
        textoRequerimentoEditado.value = textoAtual;
        modalEdicao.style.display = 'flex';
        ajustarTextareaModal();
        
        // Foca no textarea e coloca o cursor no final
        setTimeout(() => {
            textoRequerimentoEditado.focus();
            textoRequerimentoEditado.selectionStart = textoRequerimentoEditado.value.length;
        }, 100);
    });

    // Cancelar edição
    btnCancelarEdicao.addEventListener('click', function() {
        modalEdicao.style.display = 'none';
    });

    // Salvar edição
    btnSalvarEdicao.addEventListener('click', function() {
        const novoTexto = textoRequerimentoEditado.value.trim();
        
        if (!novoTexto) {
            alert('O requerimento não pode estar vazio.');
            return;
        }

        const paragrafos = novoTexto.split('\n').filter(p => p.trim() !== '');
        descricaoConteudo.innerHTML = paragrafos.map(p => `<p>${p}</p>`).join('');
        
        // Atualiza o status para refletir a edição
        statusBox.innerHTML = `
            <h3>STATUS</h3>
            <div class="status-item status-enviado">ENVIADO</div>
            <div class="status-item status-pendente">AGUARDANDO ANÁLISE (EDITADO)</div>
        `;
        
        modalEdicao.style.display = 'none';
        alert('Requerimento atualizado com sucesso!');
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalEdicao) {
            modalEdicao.style.display = 'none';
        }
    });

    // Ajustar textarea quando a janela é redimensionada
    window.addEventListener('resize', function() {
        if (modalEdicao.style.display === 'flex') {
            ajustarTextareaModal();
        }
    });

    // Estado inicial
    function init() {
        // Verifica se já existe um requerimento (simulação)
        const requerimentoExistente = localStorage.getItem('ultimoRequerimento');
        if (requerimentoExistente) {
            descricaoConteudo.innerHTML = `<p>${requerimentoExistente}</p>`;
            statusBox.innerHTML = `
                <h3>STATUS</h3>
                <div class="status-item status-processado">PROCESSADO PELA SECRETARIA</div>
            `;
            btnEditarRequerimento.style.display = 'block';
        } else {
            descricaoConteudo.innerHTML = '<p>Nenhum requerimento enviado ainda.</p>';
            statusBox.innerHTML = `
                <h3>STATUS</h3>
                <div class="status-item status-vazio">Nenhum status disponível</div>
            `;
            btnEditarRequerimento.style.display = 'none';
        }
    }

    init();
});