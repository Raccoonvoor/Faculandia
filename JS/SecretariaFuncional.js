document.addEventListener('DOMContentLoaded', function() {
    // Exibir o nome do usuário logado
    const nomeUsuario = localStorage.getItem('nomeAluno');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Variável para armazenar o processo selecionado (agora usando let)
    let processoSelecionado = null;

    // Elementos da seção de encaminhamento
    const secaoEncaminhamento = document.querySelector('.secao-encaminhamento');
    const conteudoProcessoSelecionado = document.getElementById('conteudoProcessoSelecionado');
    const btnEncaminhar = document.getElementById('btnEncaminhar');
    const seletorOpcoes = document.getElementById('seletorOpcoes');
    const btnDesselecionar = document.getElementById('btnDesselecionar');
    const botoesProcessoSelecionado = document.querySelector('.botoes-processo-selecionado');

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
            botoesProcessoSelecionado.style.display = 'flex';
            
            // Rola a página até a seção de encaminhamento
            secaoEncaminhamento.scrollIntoView({ behavior: 'smooth' });
        });
    });

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
        
        // Aqui você pode adicionar a lógica para enviar os dados para o servidor
        console.log('Processo encaminhado:', {
            conteudo: processoSelecionado,
            departamento: departamento
        });
        
        // Feedback visual
        alert(`Processo encaminhado com sucesso para: ${departamento}`);
        
        // Limpa a seleção
        desselecionarProcesso();
    });
});