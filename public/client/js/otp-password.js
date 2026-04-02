const inputs = document.querySelectorAll('.otp-input');
const hiddenInput = document.querySelector('#otp-value');

inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value && index != inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});

const button = document.querySelector('.btn.btn-primary.w-100');
console.log(button);
button.addEventListener('click', () => {
    hiddenInput.value = Array.from(inputs, i => i.value).join('');
    console.log(hiddenInput.value);
    console.log('click');
})

