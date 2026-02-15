createTree = (arr, parentId = '') => {
    const tree = []; // Tạo mảng cây
        arr.forEach((item) => {

            // Tìm kiếm các object thuộc một id cha nào đó
            if (item.parent_id === parentId) {
                const newItem = item;
                
                // Tiếp tục quy trình duyệt toàn bộ mảng lần nữa để tìm kiếm các object thuộc id cha
                // Việc đệ quy này sẽ ngừng khi không còn phần tử nào có parent_id bằng parrentId hiện tại
                const children = createTree(arr, item.id);

                if (children.length > 0) {
                    newItem.children = children; // Trong newItem: Thêm 1 key children chứa mảng các object con
                }
                tree.push(newItem);
            }
        });
    return tree; // Trả về mảng của các object
}

// Mảng được tạo sẽ có dạng mảng chứa các object là danh mục con,
    // và trong mỗi object lại có children là mảng của các object con phía dưới

    // Ví dụ kết quả: 
    // [
    //     Thời trang {
    //         ...
    //         ...
    //         ...
    //         children: [
    //             Thời trang nam {
    //                 ...
    //             },
    //             Thời trang nữ {
    //                 ...
    //             }
    //         ]
    //     },
    //     Điện tử {

    //     },
    //     Đồ ăn {

    //     },
    // ]

module.exports.tree = (arr, parentId='') => {
    const tree = createTree(arr, parentId);
    return tree;
}