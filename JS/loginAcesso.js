document.addEventListener('DOMContentLoaded', function() {
    // Pega o botão de ACESSAR
    const loginButton = document.querySelector('.login-button');
    
    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão
            
            // Pega os valores dos campos
            const inputs = document.querySelectorAll('.login-container input');
            const nome = inputs[0].value.trim();
            const matricula = inputs[1].value.trim();
            const senha = inputs[2].value.trim();

            // Verifica se o nome foi preenchido
            if (!nome) {
                alert('Por favor, insira seu nome completo.');
                return;
            }
            
            // Come os espaços da matrícula pra não dar merda.
            if (!matricula) {
                alert('Por favor, insira sua matrícula.');
                return;
            }

            // Pega só dois primeiros dígitos da matrícula pra uma string pra verificar isso.
            const doisPrimeirosDigitos = matricula.substring(0, 2);
            // Transforma em número a string de cima.
            const numeroMatricula = parseInt(doisPrimeirosDigitos);
            
            // Se o usuário for burrinho e não saber o que é um número, isso daqui avisa.
            if (isNaN(numeroMatricula)) {
                alert('Matrícula inválida. Os dois primeiros dígitos devem ser números.');
                return;
            }

            // Isso daqui vai verificar se é só números que o caba tá colocando e se são exatamente 8.
            if (matricula.length !== 8 || !/^\d+$/.test(matricula)) {
                alert('Matrícula deve ter 8 dígitos numéricos.');
                return;
            }

            // Salva o nome do aluno no localStorage antes de redirecionar
            localStorage.setItem('nomeAluno', nome);
            // Adicione isso após validar o login
            localStorage.setItem('matriculaAluno', matricula);

            // Verificar e encaminhar pro lugar certo
            if (numeroMatricula >= 10 && numeroMatricula <= 40) { // Alunos: matrícula 10-40.
                window.location.href = '../HTML/telaAluno.html';
            } 
            else if (numeroMatricula >= 41 && numeroMatricula <= 70) { // Secretaria: matrícula 41-70
                window.location.href = '../HTML/telaSecretaria.html';
            } 
            else if (numeroMatricula >= 71 && numeroMatricula <= 99) { // Área Específica: matrícula 71-99
                window.location.href = '../HTML/telaAreaEspecifica.html';
            }
            else {
                // Evitar a merda.
                alert('Matrícula não está em nenhum intervalo válido (10-99).');
            }
        });
    }
});