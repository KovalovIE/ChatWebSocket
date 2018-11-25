let nicknameLogin = document.getElementById('nicknameLogin');
let passwordLogin = document.getElementById('passwordLogin');
let btnLoginReg = document.getElementById('btnLoginReg');
let btnLogin = document.getElementById('btnLogin');
let informationBlock = document.getElementById('informationBlock');

btnLogin.addEventListener('click', function() {
    let json = JSON.stringify({
        nickname: nicknameLogin.value,
        password: passwordLogin.value
    });
    console.log(JSON.parse(json))

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "/login");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = readyState;
    xhr.send(json);

    function readyState() {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);
            if (response.text === 'You are logged in') {
                informationBlock.style.display = 'block';
                informationBlock.innerHTML = response.text;
                localStorage.setItem('nicknameActive', response.nickname)

                function redirectToChatPage() {
                    window.location.href = "http://localhost:3000/chat.html";
                };
                setTimeout(redirectToChatPage, 2500);
            } else {
                informationBlock.style.display = 'block';
                informationBlock.innerHTML = xhr.responseText;
            }

        }
    }
});

btnLoginReg.addEventListener('click', function() {
    window.location.href = "http://localhost:3000/registration.html";
})