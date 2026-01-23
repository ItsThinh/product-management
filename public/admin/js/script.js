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
