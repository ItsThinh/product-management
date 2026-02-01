const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach(button => {

        const formChangeStatus = document.querySelector('#form-change-status');
        const path = formChangeStatus.getAttribute('data-path');

        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const status = button.getAttribute('data-status');

            const statusChange = status == 'active' ? 'inactive' : 'active';

            console.log(`product.js: ${productId} - ${statusChange}`);

            const action = path + `/${statusChange}/${productId}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
            // submit() kích hoạt submit dữ liệu từ form tới url trong action để xử lý
        });
    });
}


// Button Delete
const buttonDelete = document.querySelectorAll('[button-delete]');
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path = formDeleteItem.getAttribute('data-path');
    buttonDelete.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirm = confirm('Bạn có chắc muốn xóa sản phẩm này?');
            if (isConfirm) {
                const productId = button.getAttribute('data-id');
                const action = `${path}/${productId}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}

// End Button Delete