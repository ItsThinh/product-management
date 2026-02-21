// Permissions
const tablePermissions = document.querySelector('[table-permissions]');

if (tablePermissions) {

    const updateButton = document.querySelector('[button-submit]');
    updateButton.addEventListener('click', () => {

        const rows = document.querySelectorAll('[data-name]');

        const permissions = [];
        rows.forEach(row => {
            const name = row.getAttribute('data-name');
            const inputs = row.querySelectorAll('input');

            if (name === 'id') {
                inputs.forEach(item => {
                    permissions.push({
                        id: item.value,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((item, index) => {
                    const checked = item.checked;
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        console.log(permissions);

        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector('#form-change-permissions');
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }
        
    })
}
// End Permissions

// Permissions Data Default

const dataRecords = document.querySelector('[data-records]');
if (dataRecords) {

    const records = JSON.parse(dataRecords.getAttribute('data-records'));
    records.forEach((record, recordIndex) => {

        const permissions = record.permissions;
        permissions.forEach(permission => {

            const row = document.querySelector(`[data-name='${permission}']`);
            const input = row.querySelectorAll('input')[recordIndex];
            input.checked = true;
        })
        
    })
}


// End Permissions Data Default