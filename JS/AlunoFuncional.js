document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const btnSair = document.getElementById('btnSair');
    const btnEditar = document.querySelector('.btn-editar');
    const modalEdicao = document.getElementById('modalEdicao');
    const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
    const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
    const textoRequerimento = document.getElementById('textoRequerimento');
    const descricaoConteudo = document.querySelector('.descricao-conteudo');

    // Exibir nome do usuário
    const nomeUsuario = localStorage.getItem('nomeAluno');
    if (nomeUsuario) {
        document.getElementById('nomeUsuario').textContent = nomeUsuario;
    }

    // Botão Sair
    btnSair.addEventListener('click', function() {
        localStorage.removeItem('nomeAluno');
        window.location.href = '../HTML/index.html';
    });

    // Abrir modal de edição
    btnEditar.addEventListener('click', function() {
        modalEdicao.style.display = 'flex';
    });

    // Fechar modal
    function fecharModal() {
        modalEdicao.style.display = 'none';
    }

    // Cancelar edição
    btnCancelarEdicao.addEventListener('click', fecharModal);

    // Salvar edição
    btnSalvarEdicao.addEventListener('click', function() {
        const novoTexto = textoRequerimento.value;
        // Quebra o texto em parágrafos
        const paragrafos = novoTexto.split('\n').filter(p => p.trim() !== '');
        
        // Atualiza o conteúdo da descrição
        descricaoConteudo.innerHTML = paragrafos.map(p => `<p>${p}</p>`).join('');
        
        fecharModal();
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalEdicao) {
            fecharModal();
        }
    });
});