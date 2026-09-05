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

// // Chức năng từ chối kết bạn
// const listBtnRefuseFriend = document.querySelectorAll('[btn-refuse-friend]');
// listBtnRefuseFriend.forEach(button => {
//     button.addEventListener('click', () => {
//         button.closest('.box-user').classList.add('refuse');
//         const userId = button.getAttribute('btn-refuse-friend');
//         socket.emit('CLIENT_REFUSE_FRIEND', userId);
//     })
// });
// // End chức năng từ chối kết bạn

// // Chức năng chấp nhận kết bạn
// const listBtnAcceptFriend = document.querySelectorAll('[btn-accept-friend]');
// listBtnAcceptFriend.forEach(button => {
//     button.addEventListener('click', () => {
//         button.closest('.box-user').classList.add('accepted');
//         const userId = button.getAttribute('btn-accept-friend');
//         socket.emit('CLIENT_ACCEPT_FRIEND', userId);
//     })
// });
// // End chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector('[badge-users-accept]');
if (badgeUserAccept) {
    const userId = badgeUserAccept.getAttribute('badge-users-accept');
    socket.on('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', (data) => {
        if (userId == data.userId) {
            badgeUserAccept.innerHTML = data.lengthAcceptFriends;
        }
    });
}
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// accept-requests.pug data-users-accept
const dataUsersAccept = document.querySelector('[data-users-accept]');
if (dataUsersAccept) {
    // SERVER_RETURN_INFO_CANCEL_FRIEND
    socket.on('SERVER_RETURN_USER_ID_CANCEL_FRIEND', (data) => {
        const userId = dataUsersAccept.getAttribute('data-users-accept');
        if (userId == data.userId) {
            const boxCancelFriend = dataUsersAccept.querySelector(`[user-id='${data.idUserCancel}']`);
            if (boxCancelFriend)
                boxCancelFriend.remove();
        }
    })
    // End SERVER_RETURN_INFO_CANCEL_FRIEND

    // DELEGATION BUTTON EVENT
    dataUsersAccept.addEventListener('click', (e) => {
        // CLIENT_ACCEPT_FRIEND
        const btnAccept = e.target.closest('[btn-accept-friend]');
        if (btnAccept) {
            btnAccept.closest('.box-user').classList.add('accepted');
            const userId = btnAccept.getAttribute('btn-accept-friend');
            socket.emit('CLIENT_ACCEPT_FRIEND', userId);
        }
        // End CLIENT_ACCEPT_FRIEND

        // CLIENT_REFUSE_FRIEND
        const btnRefuse = e.target.closest('[btn-refuse-friend]');
        if (btnRefuse) {
            btnRefuse.closest('.box-user').classList.add('refuse');
            const userId = btnRefuse.getAttribute('btn-refuse-friend');
            socket.emit('CLIENT_REFUSE_FRIEND', userId);
        }
        // End CLIENT_REFUSE_FRIEND
    });
    // End DELEGATION BUTTON EVENT
}

const dataUserNotFriend = document.querySelector('[data-users-not-friend]');
// SERVER_RETURN_USER_INFO_ADD_FRIEND
socket.on('SERVER_RETURN_INFO_ADD_FRIEND', (data) => {
    // accept-requests.pug: Thêm box user khi họ kết bạn
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute('data-users-accept');
        if (userId == data.userId) {
            const newBoxUser = document.createElement('div');
            newBoxUser.classList.add('col-6');
            newBoxUser.setAttribute('user-id', data.infoUser._id);

            const defaultAvatar = 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';

            newBoxUser.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img 
                            src="${data.infoUser.avatar ? data.infoUser.avatar : defaultAvatar}" 
                            alt="${data.infoUser.fullName}"
                        >
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUser.fullName}</div>
                        <div class="inner-buttons">
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accept-friend="${data.infoUser._id}"
                            >Chấp nhận</button>
                            <button 
                                class="btn btn-sm btn-secondary" 
                                btn-refuse-friend="${data.infoUser._id}"
                            >Xóa</button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-deleted-friend 
                                disabled
                            >Đã xóa</button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-accepted-friend 
                                disabled
                            >Đã chấp nhận</button>
                        </div>
                    </div>
                </div>
            `;

            dataUsersAccept.appendChild(newBoxUser);
        }
    }
    // End accept-requests.pug: Thêm box user khi họ kết bạn

    // not-friend.pug: Xóa user đang hiển thị nếu được họ gửi kết bạn
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute('data-users-not-friend');
        if (userId == data.userId) {
            const boxUser = dataUserNotFriend.querySelector(`[user-id='${data.infoUser._id}']`);
            if (boxUser)
                boxUser.remove();
        }
    }
    // End not-friend.pug: Xóa user đang hiển thị nếu được họ gửi kết bạn
});
// End SERVER_RETURN_USER_INFO_ADD_FRIEND