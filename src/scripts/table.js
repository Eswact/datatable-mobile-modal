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
    },
    {
        id: 6,
        name: 'test',
        title: 'Test',
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
    const mockData = [
        { username: "john_doe", brandName: "Alpha Corp", gsm: "+1 202 555 0147", email: "john.doe@example.com", address: "742 Evergreen Terrace" },
        { username: "emma_wilson", brandName: "NovaLabs", gsm: "+1 303 555 9981", email: "emma.wilson@example.com", address: "23 Baker Street" },
        { username: "liam_brown", brandName: "SkyNet", gsm: "+1 404 555 2211", email: "liam.brown@example.com", address: "19 Sunset Blvd" },
        { username: "olivia_smith", brandName: "NextGen", gsm: "+1 212 555 0148", email: "olivia.smith@example.com", address: "110 Ocean Drive" },
        { username: "noah_clark", brandName: "BlueTech", gsm: "+1 312 555 9932", email: "noah.clark@example.com", address: "89 Maple Avenue" },
        { username: "ava_martin", brandName: "QuantumSoft", gsm: "+1 512 555 4421", email: "ava.martin@example.com", address: "14 Oak Street" },
        { username: "william_jones", brandName: "PixelWare", gsm: "+1 917 555 7632", email: "will.jones@example.com", address: "5 Liberty Plaza" },
        { username: "sophia_davis", brandName: "HyperNet", gsm: "+1 646 555 8891", email: "sophia.davis@example.com", address: "221B Baker Street" },
        { username: "james_moore", brandName: "BrightTech", gsm: "+1 702 555 1148", email: "james.moore@example.com", address: "77 Greenway Road" },
        { username: "mia_taylor", brandName: "AeroSystems", gsm: "+1 503 555 6621", email: "mia.taylor@example.com", address: "34 Lake View" },
        { username: "benjamin_hall", brandName: "SoftCore", gsm: "+1 408 555 9912", email: "ben.hall@example.com", address: "45 Mountain Road" },
        { username: "isabella_white", brandName: "TechLabs", gsm: "+1 602 555 2247", email: "isabella.white@example.com", address: "410 Riverside Ave" },
        { username: "lucas_thomas", brandName: "DataWave", gsm: "+1 720 555 4428", email: "lucas.thomas@example.com", address: "90 River Street" },
        { username: "amelia_lee", brandName: "Cyberlink", gsm: "+1 213 555 7789", email: "amelia.lee@example.com", address: "17 High Street" },
        { username: "henry_anderson", brandName: "CoreVision", gsm: "+1 415 555 6671", email: "henry.anderson@example.com", address: "73 Pine Road" },
        { username: "harper_jackson", brandName: "NetBridge", gsm: "+1 305 555 0045", email: "harper.jackson@example.com", address: "66 Elm Street" },
        { username: "alexander_miller", brandName: "LogicWare", gsm: "+1 701 555 9182", email: "alex.miller@example.com", address: "12 Old Town Lane" },
        { username: "evelyn_martinez", brandName: "MicroByte", gsm: "+1 860 555 2914", email: "evelyn.martinez@example.com", address: "55 West Avenue" },
        { username: "daniel_garcia", brandName: "SilverTech", gsm: "+1 909 555 8841", email: "daniel.garcia@example.com", address: "3 Harbor Street" },
        { username: "charlotte_robinson", brandName: "Digisoft", gsm: "+1 650 555 0987", email: "charlotte.robinson@example.com", address: "900 Hilltop Rd" },
        { username: "michael_clarkson", brandName: "BlueSpark", gsm: "+1 415 555 7711", email: "michael.clarkson@example.com", address: "41 Country Road" },
        { username: "ella_harris", brandName: "NeonWorks", gsm: "+1 720 555 9945", email: "ella.harris@example.com", address: "5 Hill Street" },
        { username: "sebastian_lopez", brandName: "FusionTek", gsm: "+1 310 555 2024", email: "sebastian.lopez@example.com", address: "100 Park Avenue" },
        { username: "avery_green", brandName: "OptiCore", gsm: "+1 602 555 1159", email: "avery.green@example.com", address: "43 Mill Road" },
        { username: "jack_walker", brandName: "CubeSoft", gsm: "+1 512 555 7723", email: "jack.walker@example.com", address: "9 Silver Street" },
        { username: "scarlett_adams", brandName: "ProximaTech", gsm: "+1 303 555 8893", email: "scarlett.adams@example.com", address: "28 East Lane" },
        { username: "owen_baker", brandName: "SoftEdge", gsm: "+1 213 555 4419", email: "owen.baker@example.com", address: "47 Kingsway" },
        { username: "aria_gonzalez", brandName: "InfraCore", gsm: "+1 702 555 0031", email: "aria.gonzalez@example.com", address: "82 Lake Rd" },
        { username: "jackson_perez", brandName: "DataLogic", gsm: "+1 503 555 1299", email: "jackson.perez@example.com", address: "321 South Street" }
    ];

    // Create DataTable with mock data
    customersTable = $('#customers').DataTable({
        // serverSide: true,
        // processing: true,
        // ajax: {
        //     url: "api-endpoint",
        //     type: "POST",
        //     // response
        //     dataSrc: function(json) {
        //         return json.data;
        //     },
        //     // filters
        //     data: function (d) {
        //         d.username = null;
        //         d.mail = null;
        //         d.phone = null;
        //     },
        // },
        data: mockData,
        paging: true,
        scrollX: true,
        columns: [
            {
                data: "username",
                render: d => d ? `<div class="cell flex-center">${d}</div>` : '-'
            },
            {
                data: "brandName",
                render: d => d ? `<div class="cell flex-center">${d}</div>` : '-',
                orderable: false
            },
            {
                data: "gsm",
                render: d => d ? `<div class="cell flex-center">${d}</div>` : '-',
                orderable: false
            },
            {
                data: "email",
                render: d => d ? `<div class="cell flex-center">${d}</div>` : '-',
                orderable: false
            },
            {
                data: "address",
                render: d => d ? `<div class="cell flex-center">${d}</div>` : '-',
                orderable: false
            },
            {
                data: null,
                render: () => `<div class="cell flex-center"><button class="accept-button">Accept</button></div>`,
                orderable: false
            },
            {
                data: null,
                render: () => `<div class="cell flex-center">Test</div>`,
                orderable: false
            },
        ],
        drawCallback: function () {
            const api = this.api();
            const mobileHelper = new DataTableMobileHelper({
                table: api,
                modalTitle: 'Customer Details',
                primaryColumns: [0, 5], // Show username & process columns in mobile view
                excludeColumns: [5],    // Dont show process column in mobile modal
                mobileOnlyColumns: [6], // Show test column only on mobile
                columnGroups: [{
                    name: 'Contact Info',
                    columns: [2, 3, 4],
                }],
                columnRenders: {
                    6: function (data, columnIndex, rowData) {
                        return `test`;
                    }
                },
                theme: { 
                    detailButtonColor: 'var(--second-color)' 
                }
            });
        },
    });
});