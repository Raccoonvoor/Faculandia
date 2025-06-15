document.addEventListener('DOMContentLoaded', function() {
    const nomeUsuario = localStorage.getItem('nomeAluno');
    const conteudoProcessoSelecionado = document.getElementById('conteudoProcessoSelecionado');
    const btnEncaminhar = document.getElementById('btnEncaminhar');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnDesselecionar = document.getElementById('btnDesselecionar');
    const botoesProcessoSelecionado = document.querySelector('.botoes-processo-selecionado');

    // Exibir nome do usuário.
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Variável para armazenar o processo selecionado.
    let processoSelecionado = null;

    // Função para carregar os requerimentos.
    function carregarRequerimentos() {
        const secaoProcessos = document.querySelector('.secao-processos');
        secaoProcessos.innerHTML = '<h2 class="section-title">PROCESSOS NOVOS</h2>';
        
        const requerimentos = JSON.parse(localStorage.getItem('requerimentos')) || [];
        const requerimentosAtivos = requerimentos.filter(req => 
            req.status === 'enviado' || req.status === 'editado'
        );
        
        if (requerimentosAtivos.length === 0) {
            secaoProcessos.innerHTML += '<p class="nenhum-processo">Nenhum requerimento pendente</p>';
        } else {
            requerimentosAtivos.sort((a, b) => new Date(b.data) - new Date(a.data)).forEach(req => {
                const processo = document.createElement('div');
                processo.className = 'processo';
                processo.dataset.id = req.id;
                
                processo.innerHTML = `
                    <div class="processo-conteudo">
                        <p><strong>Aluno:</strong> ${req.aluno} (${req.matricula})</p>
                        <p><strong>Protocolo:</strong> ${req.id}</p>
                        <p><strong>Data:</strong> ${new Date(req.data).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${req.status.toUpperCase()}</p>
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
            <p><strong>Status:</strong> ${req.status.toUpperCase()}</p>
            <hr>
            ${req.conteudo.split('\n').map(p => `<p>${p}</p>`).join('')}
        `;
        
        botoesProcessoSelecionado.style.display = 'flex';
    }

    // Função para desselecionar o processo.
    function desselecionarProcesso() {
        processoSelecionado = null;
        conteudoProcessoSelecionado.innerHTML = '<p vazio>Nenhum processo selecionado</p>';
        botoesProcessoSelecionado.style.display = 'none';
    }

    // Desselecionar processo.
    btnDesselecionar.addEventListener('click', desselecionarProcesso);

    // Encaminhar processo.
    btnEncaminhar.addEventListener('click', function() {
        if (!processoSelecionado) {
            alert('Por favor, selecione um processo para encaminhar.');
            return;
        }
        
        const departamento = seletorOpcoes.value;
        if (!departamento) {
            alert('Por favor, selecione um departamento para encaminhar.');
            return;
        }
        
        const nomeUsuario = localStorage.getItem('nomeAluno');
        let requerimentos = JSON.parse(localStorage.getItem('requerimentos'));
        const reqIndex = requerimentos.findIndex(r => r.id == processoSelecionado);
        
        if (reqIndex !== -1) {
            // Atualiza o status e adiciona ao histórico.
            requerimentos[reqIndex].status = 'encaminhado';
            requerimentos[reqIndex].destino = departamento;
            requerimentos[reqIndex].historico.push({
                acao: 'encaminhado',
                para: departamento,
                data: new Date().toISOString(),
                por: nomeUsuario,
                descricao: `Encaminhado para ${departamento}`
            });
            
            localStorage.setItem('requerimentos', JSON.stringify(requerimentos));
            alert(`Processo encaminhado para ${departamento}!`);
            carregarRequerimentos();
            desselecionarProcesso();
        }
    });

    // Botão Sair.
    document.getElementById('btnSair').addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        localStorage.removeItem('matriculaAluno');
        window.location.href = '../HTML/index.html';
    });

    carregarRequerimentos();
});