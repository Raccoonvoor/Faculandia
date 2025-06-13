document.getElementById('loginForm').addEventListener('submit', function(event) {

    // impedir que o site fique girando em círculos.
    event.preventDefault();
    
    // Verifica se o nome foi preenchido
    const nome = document.getElementById('nome').value.trim();
    if (!nome) {
        alert('Por favor, insira seu nome completo.');
        return;
    }
    
    // Come os espaços da matrícula pra não dar merda.
    const matricula = document.getElementById('matricula').value.trim();
    
    // Se o mano esquecer de colocar o nome na matrícula.
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

    // Verificar e encaminhar pro lugar certo
    if (numeroMatricula >= 10 && numeroMatricula <= 40) { // Alunos: matrícula 10-40.
        window.location.href = 'telaAluno.html';
    } 
    else if (numeroMatricula >= 41 && numeroMatricula <= 70) { // Secretaria: matrícula 41-70
        window.location.href = 'telaSecretaria.html';
    } 
    else if (numeroMatricula >= 71 && numeroMatricula <= 99) { // Área Específica: matrícula 71-99
        window.location.href = 'telaAreaEspecifica.html';
    }
    else {
        // Evitar a merda.
        alert('Matrícula não está em nenhum intervalo válido (10-99).');
    }
});