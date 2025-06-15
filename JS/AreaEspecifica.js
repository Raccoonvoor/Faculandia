document.addEventListener('DOMContentLoaded', function() {
    // Recupera dados do usuário
    const nomeUsuario = localStorage.getItem('nomeAluno');
    const matricula = localStorage.getItem('matriculaAluno');
    
    // Exibe nome do usuário
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }
    
    // Determina e exibe a área específica
    if (matricula) {
        const doisPrimeirosDigitos = matricula.substring(0, 2);
        let areaUsuario = '';
        
        if (doisPrimeirosDigitos === '75') {
            areaUsuario = 'TESOURARIA';
        } else if (doisPrimeirosDigitos === '80') {
            areaUsuario = 'BIBLIOTECA';
        } else if (doisPrimeirosDigitos === '85') {
            areaUsuario = 'COORDENAÇÃO';
        } else {
            areaUsuario = 'ÁREA DESCONHECIDA';
        }
        
        document.getElementById('areaUsuario').textContent = areaUsuario;
    }

    // Variáveis de controle
    let processoSelecionado = null;
    const secaoParecer = document.querySelector('.secao-parecer');
    const conteudoProcessoSelecionado = document.getElementById('conteudoProcessoSelecionado');
    const btnEmitirParecer = document.getElementById('btnEmitirParecer');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnDesselecionar = document.getElementById('btnDesselecionar');

    // Função para carregar os requerimentos encaminhados
    function carregarRequerimentosEncaminhados() {
        const areaUsuario = document.getElementById('areaUsuario').textContent.toLowerCase();
        const requerimentos = JSON.parse(localStorage.getItem('requerimentos')) || [];
        const secaoProcessos = document.querySelector('.secao-processos');
        
        // Limpa os processos existentes (exceto o título)
        const processosContainer = document.createElement('div');
        
        requerimentos.forEach(req => {
            if (req.status === 'encaminhado' && req.destino === areaUsuario) {
                const processoHTML = `
                    <div class="processo" data-id="${req.id}">
                        <div class="processo-conteudo">
                            <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
                            <p><strong>Protocolo:</strong> ${req.id}</p>
                            <p><strong>Data:</strong> ${new Date(req.data).toLocaleString()}</p>
                            <p><strong>Encaminhado por:</strong> ${req.historico.find(h => h.acao === 'encaminhado').por}</p>
                            <hr>
                            ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
                        </div>
                        <button class="btn-processo">Selecionar</button>
                    </div>
                `;
                processosContainer.innerHTML += processoHTML;
            }
        });
        
        // Substitui o conteúdo da seção de processos
        const titulo = secaoProcessos.querySelector('.section-title');
        secaoProcessos.innerHTML = '';
        secaoProcessos.appendChild(titulo);
        secaoProcessos.appendChild(processosContainer);
        
        // Adiciona os eventos aos novos botões
        document.querySelectorAll('.btn-processo').forEach(botao => {
            botao.addEventListener('click', function() {
                // Remove a seleção anterior
                document.querySelectorAll('.processo').forEach(proc => {
                    proc.classList.remove('selecionado');
                });
                
                // Destaca o processo selecionado
                const processo = this.closest('.processo');
                processo.classList.add('selecionado');
                
                // Armazena o ID do processo selecionado
                processoSelecionado = processo.dataset.id;
                
                // Atualiza a seção de parecer
                const req = JSON.parse(localStorage.getItem('requerimentos'))
                    .find(r => r.id == processoSelecionado);
                
                conteudoProcessoSelecionado.innerHTML = `
                    <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
                    <p><strong>Protocolo:</strong> ${req.id}</p>
                    <p><strong>Data:</strong> ${new Date(req.data).toLocaleString()}</p>
                    <p><strong>Encaminhado por:</strong> ${req.historico.find(h => h.acao === 'encaminhado').por}</p>
                    <hr>
                    ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
                `;
                
                secaoParecer.classList.add('com-processo-selecionado');
            });
        });
    }

    // Função para desselecionar processo
    function desselecionarProcesso() {
        document.querySelectorAll('.processo').forEach(proc => {
            proc.classList.remove('selecionado');
        });
        
        processoSelecionado = null;
        conteudoProcessoSelecionado.innerHTML = '<p vazio>Nenhum processo selecionado</p>';
        secaoParecer.classList.remove('com-processo-selecionado');
    }

    // Desselecionar processo
    btnDesselecionar.addEventListener('click', desselecionarProcesso);

    // Emitir parecer
    btnEmitirParecer.addEventListener('click', function() {
        if (!processoSelecionado) {
            alert('Por favor, selecione um processo para emitir parecer.');
            return;
        }
        
        if (!seletorOpcoes.value) {
            alert('Por favor, selecione uma opção de parecer.');
            return;
        }
        
        const parecer = seletorOpcoes.options[seletorOpcoes.selectedIndex].text;
        const areaUsuario = document.getElementById('areaUsuario').textContent.toLowerCase();
        
        // Atualiza o requerimento no "banco de dados"
        let requerimentos = JSON.parse(localStorage.getItem('requerimentos'));
        const reqIndex = requerimentos.findIndex(r => r.id == processoSelecionado);
        
        if (reqIndex !== -1) {
            requerimentos[reqIndex].status = 'processado';
            requerimentos[reqIndex].parecer = parecer.toLowerCase();
            requerimentos[reqIndex].historico.push({
                acao: 'processado',
                parecer: parecer.toLowerCase(),
                data: new Date().toISOString(),
                por: localStorage.getItem('nomeAluno'),
                area: areaUsuario
            });
            
            localStorage.setItem('requerimentos', JSON.stringify(requerimentos));
            
            // Feedback visual
            alert(`Parecer "${parecer}" emitido com sucesso para o processo ${processoSelecionado}`);
            
            // Atualiza a lista de processos
            carregarRequerimentosEncaminhados();
            
            // Limpa a seleção
            desselecionarProcesso();
            seletorOpcoes.value = '';
        }
    });

    // Botão Sair
    document.getElementById('btnSair').addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        localStorage.removeItem('matriculaAluno');
        window.location.href = '../HTML/index.html';
    });

    // Carregar requerimentos ao iniciar
    carregarRequerimentosEncaminhados();
});