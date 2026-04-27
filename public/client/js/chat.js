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
            // Stop Typing Visual
            socket.emit('CLIENT_SEND_TYPING', 'hide');
        }
    });
    ScrollToBottom();
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const userId = document.querySelector('[my-id]').getAttribute('my-id');
    const div = document.createElement('div');
    const elementTyping = document.querySelector('.inner-list-typing');
    let htmlFullName = '';
    if (userId == data.userId) {
        div.classList.add('message', 'sent');
    } else {
        htmlFullName = `<strong style="display:block; font-size: 12px; margin-bottom: 3px;">${data.fullName}</strong>`;
        div.classList.add('message', 'received');
    }
    div.innerHTML = `
        ${htmlFullName}
        <span>${data.content}</span>
    `;

    const chatBody = document.querySelector('#chat-container');
    chatBody.insertBefore(div, elementTyping);
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

// Show Typing
var typingTimeOut;
const showTyping = () => {
    socket.emit('CLIENT_SEND_TYPING', 'show');
    clearTimeout(typingTimeOut);
    typingTimeOut = setTimeout(() => {
        socket.emit('CLIENT_SEND_TYPING', 'hide');
    }, 3000);
}
// End Show Typing


// Insert Emoji Into Text Input
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    const inputChat = document.querySelector('input[name="content"]');
    const emoji = e.detail.unicode;
    inputChat.value = inputChat.value + emoji;

    // Fix: ensure input retains focus and cursor stays at the end after icon insertion (when text overflows)
    const endRangeSelection = inputChat.value.length;
    inputChat.setSelectionRange(endRangeSelection, endRangeSelection);
    inputChat.focus();
    // End Fix


    showTyping();
});
// End Insert Emoji Into Text Input

// Typing Visualization
const inputChat = document.querySelector('input[name="content"]');
inputChat.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') return;
    showTyping();
})

// SERVER_RETURN_TYPING
const elementTyping = document.querySelector('.inner-list-typing');
socket.on('SERVER_RETURN_TYPING', (data) => {
    if (data.type == 'show') {
        const boxTyping = document.createElement('div');
        boxTyping.classList.add('box-typing');
        boxTyping.setAttribute('user-id', data.userId);

        const userIsTyping = document.querySelector(`[user-id="${data.userId}"]`);
        if (!userIsTyping) {
            boxTyping.innerHTML = `
                <strong style="display:block; font-size: 12px; margin-bottom: 3px;">${data.fullName}</strong>
                <div class='inner-dots'>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            elementTyping.appendChild(boxTyping);
            ScrollToBottom();
        }   
    } else if(data.type == 'hide') {
        const boxTypingRemove = elementTyping.querySelector(`[user-id="${data.userId}"]`);
        if (boxTypingRemove) {
            elementTyping.removeChild(boxTypingRemove);
        }
    }
});
// End SERVER_TYPING
// End Typing Visualization