

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

document.addEventListener('DOMContentLoaded', async () => {
  const name = getCookie('username');

  try {
    const response = await fetch('/hash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    token = data;

  } catch (error) {
    console.error('Fetch error:', error);
  }

  let isInternalNavigation = false;

  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('isTabClosed', 'true');
  });

  window.addEventListener('load', function () {
    sessionStorage.setItem('isTabClosed', 'false');
  });

  window.addEventListener('unload', function () {
    if (!isInternalNavigation && sessionStorage.getItem('isTabClosed') === 'true') {
      fetch('/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: getCookie('username')})
      });
    }
  });

  const socket = io({
    query: {
      sessionId: token,
      userName: name
    }
  });

  window.socket = socket;


  socket.on('someonelogged', (data) => {
    const usersList = document.getElementById('usersList');
    const button = document.createElement('button');
    button.textContent = data.username;
    button.className = 'user-button';
    button.addEventListener('click', () => {
      localStorage.setItem('recipient', data.username);
      isInternalNavigation = true;
      window.location.href = `/chat/${getCookie('username')}/${data.username}`;
    });
    const li = document.createElement('li');
    li.appendChild(button);
    usersList.appendChild(li);
  });

  socket.on('someoneleft', (data) => {
    const usersList = document.getElementById('usersList');
    const userElements = usersList.querySelectorAll('li');
    userElements.forEach((li) => {
      const button = li.querySelector('button');
      if (button && button.textContent === data.username) {
        usersList.removeChild(li);
      }
    });
  });

  socket.on('chat message', (msg) => {
    if (window.location.href.includes(localStorage.getItem('recipient'))) {
      const item = document.createElement('li');
      item.textContent = localStorage.getItem('recipient') +': '+ msg;
      messages.appendChild(item);
    }
  });


  socket.on('wrong password', () => {
    alert('Wrong password');
  });
});

