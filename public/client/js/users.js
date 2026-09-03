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

// Chức năng hủy yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll('[btn-cancel-friend]');
listBtnCancelFriend.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.box-user').classList.remove('add');
        const userId = button.getAttribute('btn-cancel-friend');
        socket.emit('CLIENT_CANCEL_FRIEND', userId);
    })
});
// End Chức năng hủy yêu cầu kết bạn

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll('[btn-refuse-friend]');
listBtnRefuseFriend.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.box-user').classList.add('refuse');
        const userId = button.getAttribute('btn-refuse-friend');
        socket.emit('CLIENT_REFUSE_FRIEND', userId);
    })
});
// End chức năng từ chối kết bạn
