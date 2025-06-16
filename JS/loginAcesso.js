document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login-button');
    
    loginButton?.addEventListener('click', (e) => {
        e.preventDefault();
        
        const [nameInput, matInput, passInput] = document.querySelectorAll('.login-container input');
        const nome = nameInput.value.trim();
        const matricula = matInput.value.trim();
        const senha = passInput.value.trim();
        
        // Validações básicas.
        if (!nome) return alert('Por favor, informe seu nome.');
        if (!matricula) return alert('Por favor, informe sua matrícula.');
        if (matricula.length !== 8 || !/^\d+$/.test(matricula)) {
            return alert('Matrícula inválida! Deve conter 8 dígitos numéricos.');
        }
        if (!senha) return alert('Por favor, informe sua senha.');

        // Salva os dados.
        localStorage.setItem('nomeAluno', nome);
        localStorage.setItem('matriculaAluno', matricula);

        // Redireciona baseado na matrícula.
        const prefixo = parseInt(matricula.substring(0, 2));
        if (prefixo >= 10 && prefixo <= 40) {
            window.location.href = 'telaAluno.html';
        } else if (prefixo >= 41 && prefixo <= 70) {
            window.location.href = 'telaSecretaria.html';
        } else if (prefixo >= 71 && prefixo <= 99) {
            if (prefixo === 75) {
                localStorage.setItem('areaUsuario', 'tesouraria');
            } else if (prefixo === 80) {
                localStorage.setItem('areaUsuario', 'biblioteca');
            } else if (prefixo === 85) {
                localStorage.setItem('areaUsuario', 'coordenacao');
            }
            window.location.href = 'telaAreaEspecifica.html';
        } else {
            alert('Matrícula inválida! O prefixo deve estar entre 10 e 99.');
        }
    });
});