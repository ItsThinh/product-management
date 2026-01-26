module.exports = (paginationObject, query, totalProduct) => {
    if (query.page) {
        paginationObject.currentPage = parseInt(query.page);
    }

    const totalPage = Math.ceil(totalProduct / paginationObject.limit);
    paginationObject.totalPage = totalPage;
    const skip = (paginationObject.currentPage - 1) * paginationObject.limit;
    paginationObject.skip = skip;
    return paginationObject;
}