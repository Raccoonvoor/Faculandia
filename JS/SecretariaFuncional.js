document.addEventListener('DOMContentLoaded', function() {
    // Exibir o nome do usuário logado
    const nomeUsuario = localStorage.getItem('nomeAluno');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Variável para armazenar o processo selecionado
    let processoSelecionado = null;

    // Elementos da seção de encaminhamento
    const secaoEncaminhamento = document.querySelector('.secao-encaminhamento');
    const conteudoProcessoSelecionado = document.getElementById('conteudoProcessoSelecionado');
    const btnEncaminhar = document.getElementById('btnEncaminhar');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnDesselecionar = document.getElementById('btnDesselecionar');
    const botoesProcessoSelecionado = document.querySelector('.botoes-processo-selecionado');

    // Função para carregar os requerimentos
    function carregarRequerimentos() {
        const requerimentos = JSON.parse(localStorage.getItem('requerimentos')) || [];
        const secaoProcessos = document.querySelector('.secao-processos');
        
        // Limpa os processos existentes (exceto o título)
        const processosContainer = document.createElement('div');
        
        requerimentos.forEach(req => {
            if (req.status === 'enviado' || req.status === 'encaminhado') {
                const processoHTML = `
                    <div class="processo" data-id="${req.id}">
                        <div class="processo-conteudo">
                            <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
                            <p><strong>Protocolo:</strong> ${req.id}</p>
                            <p><strong>Data:</strong> ${new Date(req.data).toLocaleString()}</p>
                            <hr>
                            ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
                            <hr>
                            <p><strong>Status:</strong> ${req.status.toUpperCase()}</p>
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
                
                // Atualiza a seção de encaminhamento
                const req = JSON.parse(localStorage.getItem('requerimentos'))
                    .find(r => r.id == processoSelecionado);
                
                conteudoProcessoSelecionado.innerHTML = `
                    <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
                    <p><strong>Protocolo:</strong> ${req.id}</p>
                    <p><strong>Data:</strong> ${new Date(req.data).toLocaleString()}</p>
                    <hr>
                    ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
                    <hr>
                    <p><strong>Status:</strong> ${req.status.toUpperCase()}</p>
                `;
                
                secaoEncaminhamento.classList.add('com-processo-selecionado');
                botoesProcessoSelecionado.style.display = 'flex';
                
                // Rola a página até a seção de encaminhamento
                secaoEncaminhamento.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Função para desselecionar o processo
    function desselecionarProcesso() {
        const processoSelecionadoElement = document.querySelector('.processo.selecionado');
        if (processoSelecionadoElement) {
            processoSelecionadoElement.classList.remove('selecionado');
        }
        
        processoSelecionado = null;
        conteudoProcessoSelecionado.innerHTML = '<p vazio>Nenhum processo selecionado</p>';
        secaoEncaminhamento.classList.remove('com-processo-selecionado');
        botoesProcessoSelecionado.style.display = 'none';
        seletorOpcoes.value = '';
    }

    // Desselecionar processo
    btnDesselecionar.addEventListener('click', desselecionarProcesso);

    // Encaminhar processo
    btnEncaminhar.addEventListener('click', function() {
        if (!processoSelecionado) {
            alert('Por favor, selecione um processo para encaminhar.');
            return;
        }
        
        if (!seletorOpcoes.value) {
            alert('Por favor, selecione um departamento para encaminhar.');
            return;
        }
        
        const departamento = seletorOpcoes.options[seletorOpcoes.selectedIndex].text;
        
        // Atualiza o requerimento no "banco de dados"
        let requerimentos = JSON.parse(localStorage.getItem('requerimentos'));
        const reqIndex = requerimentos.findIndex(r => r.id == processoSelecionado);
        
        if (reqIndex !== -1) {
            requerimentos[reqIndex].status = 'encaminhado';
            requerimentos[reqIndex].destino = departamento.toLowerCase();
            requerimentos[reqIndex].historico.push({
                acao: 'encaminhado',
                para: departamento.toLowerCase(),
                data: new Date().toISOString(),
                por: localStorage.getItem('nomeAluno')
            });
            
            localStorage.setItem('requerimentos', JSON.stringify(requerimentos));
            
            // Feedback visual
            alert(`Processo ${processoSelecionado} encaminhado com sucesso para: ${departamento}`);
            
            // Atualiza a lista de processos
            carregarRequerimentos();
            
            // Limpa a seleção
            desselecionarProcesso();
        }
    });

    // Botão Sair
    document.getElementById('btnSair').addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        localStorage.removeItem('matriculaAluno');
        window.location.href = '../HTML/index.html';
    });

    // Carregar requerimentos ao iniciar
    carregarRequerimentos();
});