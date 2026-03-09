module.exports.addFinalPrice = (products) => {
    const newProducts = products.map(item => {
        const newPrice = Math.floor((item.price - item.discountPercentage / 100 * item.price) * 100) / 100;
        item.newPrice = newPrice.toFixed(2);
        return item;
    });

    return newProducts;
}

module.exports.calculateFinalPrice = (product) => {

    let newPrice = Math.floor((product.price - product.discountPercentage / 100 * product.price) * 100) / 100;
    newPrice = newPrice.toFixed(2);
    return newPrice;
}