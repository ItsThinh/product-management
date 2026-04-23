// Scroll Chat To Bottom
const ScrollToBottom = () => {
    const chatBody = document.querySelector('#chat-container');
    chatBody.scrollTop = chatBody.scrollHeight;
}

ScrollToBottom();
// End Scroll Chat To Bottom

// CLIENT_SEND_MESSAGE
const formSendDdata = document.querySelector('#input-area');
if (formSendDdata) {
    formSendDdata.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit('CLIENT_SEND_MESSAGE', content);
            e.target.elements.content.value = '';
        }
    });
    ScrollToBottom();
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const userId = document.querySelector('[my-id]').getAttribute('my-id');
    const div = document.createElement('div');
    let htmlFullName = '';
    if (userId == data.userId) {
        div.classList.add('message', 'sent');
    } else {
        htmlFullName = `<strong>${data.fullName}:</strong>`;
        div.classList.add('message', 'received');
    }
    div.innerHTML = `
        ${htmlFullName}
        <span>${data.content}</span>
    `;

    const chatBody = document.querySelector('#chat-container');
    chatBody.appendChild(div);
    ScrollToBottom();
});
// End SERVER_RETURN_MESSAGE



