// Status Button
const statusButtons = document.querySelectorAll('[button-status]');
if (statusButtons.length > 0) {
    statusButtons.forEach(button => {
        button.addEventListener('click', () => {

            let url = new URL(window.location.href);
            const status = button.getAttribute('button-status');

            if (status) { 
                url.searchParams.set('status', status);
            } else {    // Nếu status có giá trị là '' thì nó sẽ được hiểu là false
                url.searchParams.delete('status');
            }
            
            button.classList.add('active');
            window.location.href = url.href;
        });
    });
}
//End Status Button

// Search Form
const searchForm = document.querySelector('#searchForm');
if (searchForm) {
    let url = new URL(window.location.href);
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Ngăn mặc định load lại trang
        
        const keyword = event.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }

        window.location.href = url;
    });
}
//End Search Form

// Pagination
const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
    
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            let url = new URL(window.location.href);
            url.searchParams.set('page', page);
            window.location.href = url;
        });
    });
}
// End Pagination

// Checkbox Multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener('click', () => {
        let checkboxStatus = false;
        if (inputCheckAll.checked) {
            checkboxStatus = true;
        } 
        inputsId.forEach(checkbox => {
            checkbox.checked = checkboxStatus;
        });
    });

    inputsId.forEach(checkbox => {
        checkbox.addEventListener('click', () => {

            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            const countCheckbox = inputsId.length;

            if (countChecked == countCheckbox) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    }); 
}
// End Checkbox Multi

// Form Change Multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();

        const typeChange = e.target.elements.type.value;
        console.log(typeChange);
        if (typeChange == 'delete-all') {
            const isConfirm = confirm('Xác nhận xóa bỏ những sản phẩm đã chọn?');
            if (!isConfirm) return;
        }

        const checkboxMulti = document.querySelector('[checkbox-multi]');
        const checkboxChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        if (checkboxChecked.length > 0) {
            let ids = [];
            checkboxChecked.forEach(input => {
                ids.push(input.value);
            })
            console.log(ids);

            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputIds.value = ids.join(', ');
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi");
        }

    }); 

}
// End Form Change Multi