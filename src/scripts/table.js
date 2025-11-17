// Set Table
var customersTable;
const tableColumns = [
    {
        id: 0,
        name: 'username',
        title: 'Username',
        check: false,
        checkId: null,
    },
    {
        id: 1,
        name: 'company',
        title: 'Company',
        check: true,
        checkId: 'companyCheck',
    },
    {
        id: 2,
        name: 'phoneNumber',
        title: 'Phone Number',
        check: true,
        checkId: 'phoneNumberCheck',
    },
    {
        id: 3,
        name: 'email',
        title: 'E-mail',
        check: true,
        checkId: 'emailCheck',
    },
    {
        id: 4,
        name: 'address',
        title: 'Address',
        check: true,
        checkId: 'addressCheck',
    },
    {
        id: 5,
        name: 'process',
        title: 'Process',
        check: false,
        checkId: null,
    }
];
var columnDefs = [];
columnDefs = tableColumns.map(function (column) {
    return { "name": column.name, "targets": column.id };
});

// User Prefs
var orderPref = [];
$(tableColumns).each(function (index, column) { orderPref.push(column.id) });

// Create Table
$(document).ready(function () {
    customersTable = $('#customers').DataTable({
        scrollX: true,
        processing: true,
        serverSide: true,
        paging: true,
        ajax: {
            url: "http://localhost:44350/admin/get-users",
            type: "POST",
            dataSrc: function(json) {
                return json.data;
            },
            data: function (d) {
                d.username = null;
                d.role = null;
                d.brand = null;
                d.state = null;
                d.mail = null;
                d.phone = null;
                d.vkn = null;
            },
        },
        columns: [
            {
                data: "username",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">${data}</div>`;
                    }
                    else { return '-'; }
                }
            },
            {
                data: "brandName",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">${data}</div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: "gsm",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">${data}</div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: "email",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">${data}</div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: "address",
                render: function (data, type, row) {
                    if (data != null) {
                        return `<div class="cell flex-center">${data}</div>`;
                    }
                    else { return '-'; }
                },
                orderable: false,
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<div class="cell flex-center">
                                <button class="accept-button">Accept</button>
                            </div>`;
                },
                orderable: false,
            }
        ],
        columnDefs: columnDefs,
        colReorder: {
            order: orderPref,
        },
        drawCallback: function () {
            // Initialize DataTable Mobile Helper
            const mobileHelper = new DataTableMobileHelper({
                table: customersTable,
                primaryColumns: [0, 5], // Show username & process columns in mobile view
                columnGroups: [{
                    name: 'Contact Info',
                    columns: [2, 3, 4],
                }],
                modalTitle: 'Customer Details',
                excludeColumns: [5], // Dont show process column in mobile view
                theme: {
                    detailButtonColor: 'var(--second-color)',
                },
            });

            mobileHelper.clickableRows = true;
        },
    });
});