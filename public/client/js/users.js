// Chức năng gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]');
listBtnAddFriend.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.box-user').classList.add('add');
        const userId = button.getAttribute('btn-add-friend');
        socket.emit('CLIENT_ADD_FRIEND', userId);
    })
});
// End Chức năng gửi yêu cầu kết bạn