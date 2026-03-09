const ProductCategory = require('../models/productCategory.model');

module.exports.getSubCategory = (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: 'active',
            deleted: false
        });

        let allSub = [...subs];
        
        for (const sub of subs) {
            const child = await getCategory(sub.id);
            allSub = allSub.concat(child);
        }
        return allSub;
    }

    const result = getCategory(parentId);
    return result;
}  