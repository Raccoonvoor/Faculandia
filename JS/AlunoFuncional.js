document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const nomeUsuario = localStorage.getItem('nomeAluno');
    const matricula = localStorage.getItem('matriculaAluno');
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
        localStorage.removeItem('matriculaAluno');
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
        mostrarRequerimento(requerimento);
        
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

    // Função para mostrar um requerimento na tela
    function mostrarRequerimento(requerimento) {
        const paragrafos = requerimento.conteudo.split('\n').filter(p => p.trim() !== '');
        descricaoConteudo.innerHTML = paragrafos.map(p => `<p>${p}</p>`).join('');
        
        // Monta o status com base no histórico
        let statusHTML = `<h3>STATUS</h3>`;
        
        // Adiciona todos os status do histórico
        requerimento.historico.forEach(item => {
            let statusClass = '';
            let statusText = '';
            
            if (item.acao === 'enviado') {
                statusClass = 'status-enviado';
                statusText = 'ENVIADO PARA SECRETARIA';
            } else if (item.acao === 'encaminhado') {
                statusClass = 'status-processado';
                statusText = `ENCAMINHADO PARA ${item.para.toUpperCase()}`;
            } else if (item.acao === 'processado') {
                statusClass = item.parecer === 'aprovado' ? 'status-aprovado' : 
                             item.parecer === 'reprovado' ? 'status-reprovado' : 'status-ajustes';
                statusText = `PARECER: ${item.parecer.toUpperCase()} (${item.area.toUpperCase()})`;
            } else if (item.acao === 'editado') {
                statusClass = 'status-pendente';
                statusText = 'EDITADO PELO ALUNO';
            }
            
            statusHTML += `<div class="status-item ${statusClass}">${statusText} - ${new Date(item.data).toLocaleString()}</div>`;
        });
        
        // Adiciona informações do protocolo
        statusHTML += `<div class="status-info">Protocolo: ${requerimento.id}</div>`;
        statusHTML += `<div class="status-info">Data de abertura: ${new Date(requerimento.data).toLocaleString()}</div>`;
        
        statusBox.innerHTML = statusHTML;
        
        // Mostra ou esconde o botão de edição
        btnEditarRequerimento.style.display = requerimento.status === 'enviado' ? 'block' : 'none';
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

        // Atualiza o requerimento no localStorage
        let requerimentos = JSON.parse(localStorage.getItem('requerimentos'));
        const matricula = localStorage.getItem('matriculaAluno');
        const reqIndex = requerimentos.findIndex(r => r.matricula === matricula && (r.status === 'enviado' || r.status === 'editado'));
        
        if (reqIndex !== -1) {
            requerimentos[reqIndex].conteudo = novoTexto;
            requerimentos[reqIndex].status = 'editado';
            requerimentos[reqIndex].historico.push({
                acao: 'editado',
                data: new Date().toISOString(),
                por: localStorage.getItem('nomeAluno')
            });
            
            localStorage.setItem('requerimentos', JSON.stringify(requerimentos));
            
            // Atualiza a visualização
            mostrarRequerimento(requerimentos[reqIndex]);
            
            modalEdicao.style.display = 'none';
            alert('Requerimento atualizado com sucesso!');
        } else {
            alert('Não foi possível encontrar o requerimento para edição.');
        }
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

    // Estado inicial - carrega os requerimentos do aluno
    function carregarRequerimentosAluno() {
        const matricula = localStorage.getItem('matriculaAluno');
        const requerimentos = JSON.parse(localStorage.getItem('requerimentos')) || [];
        
        // Filtra requerimentos do aluno atual, ordena do mais recente para o mais antigo
        const requerimentosAluno = requerimentos
            .filter(r => r.matricula === matricula)
            .sort((a, b) => new Date(b.data) - new Date(a.data));
        
        if (requerimentosAluno.length > 0) {
            // Mostra o mais recente
            mostrarRequerimento(requerimentosAluno[0]);
            
            // Se houver mais de um requerimento, adiciona seletor
            if (requerimentosAluno.length > 1) {
                criarSeletorRequerimentos(requerimentosAluno);
            }
        } else {
            descricaoConteudo.innerHTML = '<p>Nenhum requerimento enviado ainda.</p>';
            statusBox.innerHTML = `
                <h3>STATUS</h3>
                <div class="status-item status-vazio">Nenhum status disponível</div>
            `;
            btnEditarRequerimento.style.display = 'none';
        }
    }

    // Cria um seletor para alternar entre requerimentos
    function criarSeletorRequerimentos(requerimentos) {
        const seletorContainer = document.createElement('div');
        seletorContainer.className = 'seletor-requerimentos';
        
        const label = document.createElement('label');
        label.textContent = 'Selecione um requerimento: ';
        label.htmlFor = 'selectRequerimentos';
        
        const select = document.createElement('select');
        select.id = 'selectRequerimentos';
        
        requerimentos.forEach((req, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Req. ${req.id} - ${new Date(req.data).toLocaleDateString()} (${req.status})`;
            select.appendChild(option);
        });
        
        select.addEventListener('change', function() {
            mostrarRequerimento(requerimentos[this.value]);
        });
        
        seletorContainer.appendChild(label);
        seletorContainer.appendChild(select);
        
        // Insere antes da descrição
        descricaoConteudo.parentNode.insertBefore(seletorContainer, descricaoConteudo);
    }

    // Adicionar estilos para os novos elementos
    const style = document.createElement('style');
    style.textContent = `
        .status-aprovado {
            background-color: #28a745;
            color: white;
        }
        .status-reprovado {
            background-color: #dc3545;
            color: white;
        }
        .status-ajustes {
            background-color: #ffc107;
            color: #212529;
        }
        .status-info {
            margin-top: 10px;
            padding: 8px 15px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-size: 14px;
        }
        .seletor-requerimentos {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .seletor-requerimentos select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
    `;
    document.head.appendChild(style);

    // Carregar requerimentos ao iniciar
    carregarRequerimentosAluno();
});