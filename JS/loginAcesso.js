document.getElementById('loginForm').addEventListener('submit', function(event) {
    
    // impedir que o site fique girando em círculos.
    event.preventDefault();
    
    // Pra não ficar gigantesco o número de letras ali embaixo, isso daqui vai servir pra deixar tudo maiúsculo independente.
    const username = document.getElementById('username').value.trim().toUpperCase();
    
    // Avisar que o usuário esqueceu de pôr o próprio nome no bagulho.
    if (!username) {
        alert('Por favor, insira um nome de usuário.');
        return;
    }

    // Verificar só a primeira letra (também significa que nomes com uma letra só são possíveis, mas sei lá, meio tanto faz isso).
    const firstLetter = username.charAt(0);
    

    
    // Isso daqui vai verificar a primeira letra.
    // Se souberem alguma forma melhor de fazer isso, por favor me ajudem.

    if ('ABCDEFG'.includes(firstLetter)) { // Manda pra tela do aluno.
        window.location.href = 'telaAluno.html';
    } 
    
    else if ('HIJQLMNO'.includes(firstLetter)) { // Manda pra tela da secretaria.
        window.location.href = 'telaSecretaria.html';
    } 
    
    else if ('PQRSTUVWXYZ'.includes(firstLetter)) { // Manda pra área específica.
        window.location.href = 'telaAreaEspecifica.html';
    } 

    // Evitar a merda.
    else {
        alert('Letra inicial não reconhecida.');
    }
});