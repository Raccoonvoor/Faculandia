document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuario = localStorage.getItem('nomeAluno');
    const matricula = localStorage.getItem('matriculaAluno');
    const btnSair = document.getElementById('btnSair');
    const btnNovoRequerimento = document.getElementById('btnNovoRequerimento');
    const btnNovoRequerimentoLista = document.getElementById('btnNovoRequerimentoLista');
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
    const respostasConteudo = document.getElementById('respostasConteudo');
    const listaRequerimentos = document.getElementById('listaRequerimentos');
    const detalhesRequerimentoContainer = document.getElementById('detalhesRequerimentoContainer');

    let requerimentoAtualId = null;

    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    btnSair.addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        localStorage.removeItem('matriculaAluno');
        window.location.href = '../HTML/index.html';
    });

    btnNovoRequerimento.addEventListener('click', mostrarEditorRequerimento);
    btnNovoRequerimentoLista.addEventListener('click', mostrarEditorRequerimento);

    function mostrarEditorRequerimento() {
        novoRequerimentoSection.style.display = 'block';
        textoNovoRequerimento.value = '';
        textoNovoRequerimento.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnCancelarRequerimento.addEventListener('click', function() {
        novoRequerimentoSection.style.display = 'none';
    });

    btnEnviarRequerimento.addEventListener('click', function() {
        const texto = textoNovoRequerimento.value.trim();
        
        if (!texto) {
            alert('Por favor, escreva seu requerimento antes de enviar.');
            return;
        }

        enviarRequerimento(texto);
    });

    async function enviarRequerimento(texto) {
        const nomeAluno = localStorage.getItem('nomeAluno');
        const matriculaAluno = localStorage.getItem('matriculaAluno');
        
        try {
            const response = await fetch('http://localhost:3000/requerimentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conteudo: texto,
                    aluno: nomeAluno,
                    matricula: matriculaAluno,
                    status: 'enviado',
                    historico: [{
                        acao: 'enviado',
                        data: new Date().toISOString(),
                        por: nomeAluno,
                        descricao: 'Requerimento enviado pelo aluno'
                    }]
                })
            });

            if (!response.ok) throw new Error('Erro ao enviar requerimento');

            const requerimento = await response.json();
            
            carregarListaRequerimentos();
            mostrarDetalhesRequerimento(requerimento.id);
            novoRequerimentoSection.style.display = 'none';
            alert(`Requerimento enviado com sucesso! Protocolo: ${requerimento.id}`);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar requerimento. Por favor, tente novamente.');
        }
    }

    async function carregarListaRequerimentos() {
        const matriculaAluno = localStorage.getItem('matriculaAluno');
        
        try {
            const response = await fetch(`http://localhost:3000/requerimentos/${matriculaAluno}`);
            if (!response.ok) throw new Error('Erro ao carregar requerimentos');
            
            const requerimentos = await response.json();
            
            listaRequerimentos.innerHTML = '';
            
            if (requerimentos.length === 0) {
                listaRequerimentos.innerHTML = '<p class="nenhum-requerimento">Nenhum requerimento encontrado.</p>';
                detalhesRequerimentoContainer.style.display = 'none';
                return;
            }
            
            requerimentos.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(req => {
                const item = document.createElement('div');
                item.className = 'item-requerimento';
                item.dataset.id = req.id;
                
                const ultimoStatus = req.historico[req.historico.length - 1]?.acao || 'enviado';
                const statusClass = getStatusClass(ultimoStatus);
                
                item.innerHTML = `
                    <div class="requerimento-resumo ${statusClass}">
                        <div class="requerimento-id">#${req.id}</div>
                        <div class="requerimento-data">${new Date(req.data).toLocaleDateString()}</div>
                        <div class="requerimento-status ${statusClass}">${formatStatus(ultimoStatus)}</div>
                    </div>
                `;
                
                item.addEventListener('click', () => mostrarDetalhesRequerimento(req.id));
                listaRequerimentos.appendChild(item);
            });
            
            if (requerimentos.length > 0) {
                mostrarDetalhesRequerimento(requerimentos[0].id);
            }
        } catch (error) {
            console.error('Erro:', error);
            listaRequerimentos.innerHTML = '<p class="erro-carregamento">Erro ao carregar requerimentos</p>';
        }
    }

    function getStatusClass(status) {
        switch(status) {
            case 'enviado': return 'status-enviado';
            case 'editado': return 'status-editado';
            case 'encaminhado': return 'status-encaminhado';
            case 'processado': return 'status-processado';
            default: return 'status-pendente';
        }
    }

    function formatStatus(status) {
        switch(status) {
            case 'enviado': return 'ENVIADO';
            case 'editado': return 'EDITADO';
            case 'encaminhado': return 'ENCAMINHADO';
            case 'processado': return 'RESPONDIDO';
            default: return 'PENDENTE';
        }
    }

    async function mostrarDetalhesRequerimento(id) {
        requerimentoAtualId = id;
        
        try {
            const response = await fetch(`http://localhost:3000/requerimentos/${localStorage.getItem('matriculaAluno')}`);
            if (!response.ok) throw new Error('Erro ao carregar detalhes');
            
            const requerimentos = await response.json();
            const requerimento = requerimentos.find(r => r.id == id);
            
            if (!requerimento) return;
            
            btnEditarRequerimento.style.display = (requerimento.status === 'enviado' || requerimento.status === 'editado') ? 'block' : 'none';
            descricaoConteudo.innerHTML = requerimento.conteudo.split('\n')
                .filter(p => p.trim() !== '')
                .map(p => `<p>${p}</p>`)
                .join('');
            atualizarStatusRequerimento(requerimento);
            atualizarRespostas(requerimento);
            
            document.querySelectorAll('.item-requerimento').forEach(item => {
                item.classList.toggle('selecionado', item.dataset.id == id);
            });
            
            detalhesRequerimentoContainer.style.display = 'block';
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function atualizarStatusRequerimento(requerimento) {
        let statusHTML = `<h3>STATUS</h3>`;
        
        requerimento.historico.forEach(item => {
            let statusClass = '';
            let statusText = '';
            
            if (item.acao === 'enviado') {
                statusClass = 'status-enviado';
                statusText = 'ENVIADO PARA SECRETARIA';
            } else if (item.acao === 'encaminhado') {
                statusClass = 'status-encaminhado';
                statusText = `ENCAMINHADO PARA ${item.para?.toUpperCase() || ''}`;
            } else if (item.acao === 'processado') {
                statusClass = item.parecer === 'aprovado' ? 'status-processado' : 
                             item.parecer === 'reprovado' ? 'status-pendente' : 'status-editado';
                statusText = `PARECER: ${item.parecer?.toUpperCase() || ''} (${item.area?.toUpperCase() || ''})`;
            } else if (item.acao === 'editado') {
                statusClass = 'status-editado';
                statusText = 'EDITADO PELO ALUNO';
            }
            
            if (statusClass && statusText) {
                statusHTML += `<div class="status-item ${statusClass}">${statusText} - ${new Date(item.data).toLocaleString()}</div>`;
            }
        });
        
        statusHTML += `<div class="status-info">Protocolo: ${requerimento.id}</div>`;
        statusBox.innerHTML = statusHTML;
    }

    function atualizarRespostas(requerimento) {
        const respostas = requerimento.historico.filter(item => 
            item.acao === 'processado' && item.parecer
        );
        
        if (respostas.length === 0) {
            respostasConteudo.innerHTML = '<p>Nenhuma resposta disponível ainda.</p>';
        } else {
            let htmlRespostas = '';
            
            respostas.forEach(resposta => {
                const classeResposta = resposta.parecer === 'aprovado' ? 'aprovado' : 
                                      resposta.parecer === 'reprovado' ? 'reprovado' : 'ajustes';
                
                htmlRespostas += `
                    <div class="resposta-item ${classeResposta}">
                        <div class="resposta-header ${classeResposta}">
                            ${resposta.area?.toUpperCase() || 'ÁREA'} - ${resposta.parecer?.toUpperCase() || 'PARECER'}
                        </div>
                        <div class="resposta-data">
                            ${new Date(resposta.data).toLocaleString()} por ${resposta.por || 'Responsável'}
                        </div>
                        <div class="resposta-conteudo">
                            ${resposta.descricao || 'Sem descrição adicional'}
                            ${resposta.observacoes ? `<p><strong>Observações:</strong> ${resposta.observacoes}</p>` : ''}
                        </div>
                        <div class="assinatura-container">
                            <div class="assinatura-texto">Assinatura Digital:</div>
                            <img src="../Imagens/assinatura.png" alt="Assinatura" class="assinatura-img">
                        </div>
                    </div>
                `;
            });
            
            respostasConteudo.innerHTML = htmlRespostas;
        }
    }

    btnEditarRequerimento.addEventListener('click', function() {
        fetch(`http://localhost:3000/requerimentos/${localStorage.getItem('matriculaAluno')}`)
            .then(response => response.json())
            .then(requerimentos => {
                const requerimento = requerimentos.find(r => r.id == requerimentoAtualId);
                if (requerimento) {
                    textoRequerimentoEditado.value = requerimento.conteudo;
                    modalEdicao.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    textoRequerimentoEditado.focus();
                }
            })
            .catch(error => console.error('Erro:', error));
    });

    btnCancelarEdicao.addEventListener('click', function() {
        modalEdicao.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    btnSalvarEdicao.addEventListener('click', function() {
        const novoTexto = textoRequerimentoEditado.value.trim();
        
        if (!novoTexto) {
            alert('O requerimento não pode estar vazio.');
            return;
        }

        fetch(`http://localhost:3000/requerimentos/${requerimentoAtualId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conteudo: novoTexto,
                status: 'editado',
                $push: {
                    historico: {
                        acao: 'editado',
                        data: new Date().toISOString(),
                        por: localStorage.getItem('nomeAluno'),
                        descricao: 'Requerimento editado pelo aluno'
                    }
                }
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar requerimento');
            return response.json();
        })
        .then(() => {
            carregarListaRequerimentos();
            mostrarDetalhesRequerimento(requerimentoAtualId);
            modalEdicao.style.display = 'none';
            document.body.style.overflow = 'auto';
            alert('Requerimento atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar requerimento. Por favor, tente novamente.');
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalEdicao) {
            modalEdicao.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    carregarListaRequerimentos();
});