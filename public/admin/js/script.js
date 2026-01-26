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