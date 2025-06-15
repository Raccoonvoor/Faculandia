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

    // Selecionar processo
    document.querySelectorAll('.btn-processo').forEach(botao => {
        botao.addEventListener('click', function() {
            // Remove a seleção anterior
            document.querySelectorAll('.processo').forEach(proc => {
                proc.classList.remove('selecionado');
            });
            
            // Destaca o processo selecionado
            const processo = this.closest('.processo');
            processo.classList.add('selecionado');
            
            // Armazena o conteúdo do processo selecionado
            processoSelecionado = processo.querySelector('.processo-conteudo').innerHTML;
            
            // Atualiza a seção de encaminhamento com o processo selecionado
            conteudoProcessoSelecionado.innerHTML = processoSelecionado;
            secaoEncaminhamento.classList.add('com-processo-selecionado');
            
            // Rola a página até a seção de encaminhamento
            secaoEncaminhamento.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Elementos adicionais
    const btnDesselecionar = document.getElementById('btnDesselecionar');
    const botoesProcessoSelecionado = document.querySelector('.botoes-processo-selecionado');

    // Função para desselecionar o processo
    function desselecionarProcesso() {
        const processoSelecionado = document.querySelector('.processo.selecionado');
        if (processoSelecionado) {
            processoSelecionado.classList.remove('selecionado');
        }
        
        processoSelecionado = null;
        conteudoProcessoSelecionado.innerHTML = '<p vazio>Nenhum processo selecionado</p>';
        secaoEncaminhamento.classList.remove('com-processo-selecionado');
        botoesProcessoSelecionado.style.display = 'none';
        seletorOpcoes.value = '';
    }

    // Evento de seleção de processo (atualizado)
    document.querySelectorAll('.btn-processo').forEach(botao => {
        botao.addEventListener('click', function() {
            // ... (código anterior permanece o mesmo)
            
            // Mostra os botões de ação
            botoesProcessoSelecionado.style.display = 'flex';
        });
    });

    // Evento de desseleção
    btnDesselecionar.addEventListener('click', desselecionarProcesso);

    // Evento de encaminhamento (atualizado)
    if (btnEncaminhar) {
        btnEncaminhar.addEventListener('click', function() {
            // ... (código anterior permanece o mesmo)
            
            // Esconde os botões de ação após encaminhar
            botoesProcessoSelecionado.style.display = 'none';
        });
    }


    // Encaminhar processo
    if (btnEncaminhar) {
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
            
            // Aqui você pode adicionar a lógica para enviar os dados para o servidor
            console.log('Processo encaminhado:', {
                conteudo: processoSelecionado,
                departamento: departamento
            });
            
            // Feedback visual
            alert(`Processo encaminhado com sucesso para: ${departamento}`);
            
            // Limpa a seleção
            document.querySelector('.processo.selecionado').classList.remove('selecionado');
            conteudoProcessoSelecionado.innerHTML = '<p>Nenhum processo selecionado</p>';
            secaoEncaminhamento.classList.remove('com-processo-selecionado');
            seletorOpcoes.value = '';
        });
    }
});