const socket = io();
let name, time;
let textarea = document.querySelector('#textarea');
let msgarea = document.querySelector('.msgarea');

do {
    name = prompt('Please enter your name: ');
}while(!name);

function place() {
    let dateplace = document.getElementById('pac-input').value;
    alert(`Place chosen by ${name} for your date is: ${dateplace}.`);
}

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendmsg(e.target.value);
    }
})

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function showTime() {
    var h = new Date(Date.now()).getHours();
    var m = new Date(Date.now()).getMinutes();
    m = checkTime(m);
    t = (h + ":" + m);
    return t;
}

function sendmsg(message) {
    let msg = {
        user: name,
        message: message.trim(),
        usert: showTime()
    };

    //append
    appendmsg(msg, 'outgoing');
    textarea.value = '';
    scrollbottom();
    // if(textarea.value == '')
    // {
    //     alert("Please write something");
    // }
    //send to server
    socket.emit('message', msg);
}

function appendmsg(msg, type) {
    let maindiv = document.createElement('div');
    let classname = type;
    maindiv.classList.add(classname, 'msg');

    let markup = `
    <h4>${msg.user}&nbsp;&nbsp;&nbsp;${msg.usert}</h4>
    ${msg.message}</p>
    `
    maindiv.innerHTML = markup;
    msgarea.appendChild(maindiv)
}

//receive message
socket.on('message', (msg) => {
    appendmsg(msg, 'incoming');
    scrollbottom();
})


//for scroll bottom
function scrollbottom() {
    msgarea.scrollTop = msgarea.scrollHeight
}