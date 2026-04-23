import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import textFieldEdit from 'https://cdn.jsdelivr.net/npm/text-field-edit@^4/index.js'

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

// emoji-picker-element
const buttonIcon = document.querySelector('.button-icon');
const tooltip = document.querySelector('.tooltip');
Popper.createPopper(buttonIcon, tooltip);
buttonIcon.addEventListener('click', () => {
    tooltip.classList.toggle('shown');
});
// End emoji-picker-element

// Insert Emoji Into Text Input
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    textFieldEdit.insert(document.querySelector('input[name="content"]'), e.detail.unicode)
});
// End Insert Emoji Into Text Input