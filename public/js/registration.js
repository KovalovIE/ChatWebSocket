let nicknameReg = document.getElementById('nicknameReg');
let passwordReg = document.getElementById('passwordReg');
let confirmPasswordReg = document.getElementById('confirmPasswordReg');
let emailReg = document.getElementById('emailReg');
let ageReg = document.getElementById('ageReg');
let informationBlock = document.getElementById('informationBlock');


let btnReg = document.getElementById('btnReg');

btnReg.addEventListener('click', function() {
    let json = JSON.stringify({
        nickname: nicknameReg.value,
        password: passwordReg.value,
        confirmPassword: confirmPasswordReg.value,
        email: emailReg.value,
        age: ageReg.value,
    });
    console.log(JSON.parse(json))

    let xhr = new XMLHttpRequest();
    xhr.open('POST', "/registration");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = readyState;
    xhr.send(json);

    function readyState() {
        if (xhr.readyState === 4) {
            //console.log(xhr.responseText);
            informationBlock.style.display = 'block';
            informationBlock.innerHTML = xhr.responseText;

            if (xhr.responseText.length > 50) {
                function redirectToLoginPage() {
                    window.location.href = "http://localhost:3000/login.html";
                };
                setTimeout(redirectToLoginPage, 5000);
            }

        }
    }
});