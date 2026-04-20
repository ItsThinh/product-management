// CLIENT_SEND_MESSAGE
const formSendDdata = document.querySelector('#input-area');
if (formSendDdata) {
    formSendDdata.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e);
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit('CLIENT_SEND_MESSAGE', content);
            e.target.elements.content.value = '';
        }
    });    
}
// End CLIENT_SEND_MESSAGE