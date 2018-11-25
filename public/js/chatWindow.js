window.onload = (function () {
    let socket = io();

    $('form').submit(function(e) {
        e.preventDefault();
        socket.emit('send message', document.getElementById('newMessage').value);
        document.getElementById('newMessage').value = '';
      });

      socket.on('new message', function(data) {
            var messages = document.getElementById('messages');
            var li = document.createElement('li');
            var spanName = document.createElement('span');
            var spanMessage = document.createElement('span');
    
            messages.appendChild(li);
            li.appendChild(spanName);
            li.appendChild(spanMessage);
            spanName.innerText = data.user + ': ';
            spanName.style.fontWeight = 900;
            spanMessage.innerText = data.msg;
      });
      socket.emit('new user', localStorage.getItem('nicknameActive'));
    
      socket.on('get users', function(data) {
          var html = '';
          for( var i = 0; i < data.length; i++) {
             html += '<li class="users-item">'+ data[i] +'</li>' 
          }
          document.getElementById('onlineUsers').innerHTML = html;
      });
});

const logout = document.getElementById('logoutFromChat');
logout.addEventListener('click', function() {
    window.location.href = "http://localhost:3000/login.html";
})