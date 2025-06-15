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

    // Função para desselecionar processo
    function desselecionarProcesso() {
        document.querySelectorAll('.processo').forEach(proc => {
            proc.classList.remove('selecionado');
        });
        
        processoSelecionado = null;
        conteudoProcessoSelecionado.innerHTML = '<p vazio>Nenhum processo selecionado</p>';
        secaoParecer.classList.remove('com-processo-selecionado');
    }

    // Selecionar processo
    document.querySelectorAll('.btn-processo').forEach(botao => {
        botao.addEventListener('click', function() {
            desselecionarProcesso();
            
            const processo = this.closest('.processo');
            processo.classList.add('selecionado');
            
            processoSelecionado = processo.querySelector('.processo-conteudo').innerHTML;
            conteudoProcessoSelecionado.innerHTML = processoSelecionado;
            secaoParecer.classList.add('com-processo-selecionado');
            
            secaoParecer.scrollIntoView({ behavior: 'smooth' });
        });
    });

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
        console.log('Parecer emitido:', {
            conteudo: processoSelecionado,
            parecer: parecer
        });
        
        alert(`Parecer "${parecer}" emitido com sucesso!`);
        desselecionarProcesso();
        seletorOpcoes.value = '';
    });

    // Botão Sair
    document.getElementById('btnSair').addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        localStorage.removeItem('matriculaAluno');
        window.location.href = '../HTML/index.html';
    });
});