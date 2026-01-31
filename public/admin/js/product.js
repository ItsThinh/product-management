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