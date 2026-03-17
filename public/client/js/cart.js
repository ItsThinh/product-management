// Change Quantity
const quantityInputs = document.querySelectorAll('[quantity-input]');

for (const input of quantityInputs) {

    input.addEventListener('change', async (event) => {
        const newQuantity = event.target.value;
        const productId = input.getAttribute('product-id');
        window.location.href = `cart/update/${productId}/${newQuantity}`;
    })
    
}

// End Change Quantity