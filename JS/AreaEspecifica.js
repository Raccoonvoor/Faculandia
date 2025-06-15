document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuario = localStorage.getItem('nomeAluno');
    const matricula = localStorage.getItem('matriculaAluno');
    
    // Exibe nome do usuário.
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }
    
    // Determina a área específica baseada nos dois primeiros dígitos da matrícula.
    let areaUsuario = '';
    if (matricula) {
        const prefixo = matricula.substring(0, 2);
        if (prefixo === '75') areaUsuario = 'tesouraria';
        else if (prefixo === '80') areaUsuario = 'biblioteca';
        else if (prefixo === '85') areaUsuario = 'coordenacao';
    }
    
    // Exibe a área do usuário.
    document.getElementById('areaUsuario').textContent = areaUsuario.toUpperCase();

    // Variáveis de controle.
    let processoSelecionado = null;
    const conteudoProcessoSelecionado = document.getElementById('conteudoProcessoSelecionado');
    const btnEmitirParecer = document.getElementById('btnEmitirParecer');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnDesselecionar = document.getElementById('btnDesselecionar');

    // Função para carregar os requerimentos encaminhados para esta área.
    function carregarRequerimentosEncaminhados() {
        const secaoProcessos = document.querySelector('.secao-processos');
        secaoProcessos.innerHTML = '<h2 class="section-title">PROCESSOS NOVOS</h2>';
        
        const requerimentos = JSON.parse(localStorage.getItem('requerimentos')) || [];
        
        // Filtra requerimentos encaminhados para esta área e não processados.
        const requerimentosArea = requerimentos.filter(req => 
            req.destino === areaUsuario && 
            req.status === 'encaminhado' &&
            !req.historico.some(h => h.acao === 'processado' && h.area === areaUsuario)
        );
        
        if (requerimentosArea.length === 0) {
            secaoProcessos.innerHTML += '<p class="nenhum-processo">Nenhum requerimento pendente para esta área</p>';
        } else {
            requerimentosArea.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(req => {
                const processo = document.createElement('div');
                processo.className = 'processo';
                processo.dataset.id = req.id;
                
                processo.innerHTML = `
                    <div class="processo-conteudo">
                        <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
                        <p><strong>Protocolo:</strong> ${req.id}</p>
                        <p><strong>Data:</strong> ${new Date(req.data).toLocaleDateString()}</p>
                        <p><strong>Encaminhado por:</strong> ${req.historico.find(h => h.acao === 'encaminhado')?.por || 'N/A'}</p>
                        <hr>
                        ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                    <button class="btn-processo">Selecionar</button>
                `;
                secaoProcessos.appendChild(processo);
                processo.querySelector('.btn-processo').addEventListener('click', () => {
                    selecionarProcesso(req.id);
                });
            });
        }
    }

    // Função para selecionar um processo.
    function selecionarProcesso(id) {
        processoSelecionado = id;
        const req = JSON.parse(localStorage.getItem('requerimentos')).find(r => r.id == id);
        
        conteudoProcessoSelecionado.innerHTML = `
            <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
            <p><strong>Protocolo:</strong> ${req.id}</p>
            <p><strong>Data:</strong> ${new Date(req.data).toLocaleDateString()}</p>
            <p><strong>Encaminhado por:</strong> ${req.historico.find(h => h.acao === 'encaminhado')?.por || 'N/A'}</p>
            <hr>
            ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
        `;
    }

    // Função para desselecionar processo.
    function desselecionarProcesso() {
        processoSelecionado = null;
        conteudoProcessoSelecionado.innerHTML = '<p vazio>Nenhum processo selecionado</p>';
    }

    // Desselecionar processo.
    btnDesselecionar.addEventListener('click', desselecionarProcesso);

    // Emitir parecer.
    btnEmitirParecer.addEventListener('click', function() {
        if (!processoSelecionado) {
            alert('Por favor, selecione um processo para emitir parecer.');
            return;
        }
        
        const parecer = seletorOpcoes.value;
        if (!parecer) {
            alert('Por favor, selecione uma opção de parecer.');
            return;
        }
        
        const descricao = prompt("Digite uma descrição para o parecer:") || '';
        const nomeUsuario = localStorage.getItem('nomeAluno');
        const observacoes = prompt("Alguma observação adicional?") || '';
        
        // Atualiza o requerimento.
        let requerimentos = JSON.parse(localStorage.getItem('requerimentos'));
        const reqIndex = requerimentos.findIndex(r => r.id == processoSelecionado);
        
        if (reqIndex !== -1) {
            requerimentos[reqIndex].status = 'processado';
            requerimentos[reqIndex].historico.push({
                acao: 'processado',
                parecer: parecer,
                descricao: descricao,
                data: new Date().toISOString(),
                por: nomeUsuario,
                area: areaUsuario,
                observacoes: observacoes
            });
            
            localStorage.setItem('requerimentos', JSON.stringify(requerimentos));
            alert('Parecer emitido com sucesso!');
            carregarRequerimentosEncaminhados();
            desselecionarProcesso();
        }
    });

    // Botão Sair.
    document.getElementById('btnSair').addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        localStorage.removeItem('matriculaAluno');
        window.location.href = '../HTML/index.html';
    });

    carregarRequerimentosEncaminhados();
});