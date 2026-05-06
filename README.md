# datatable-mobile-modal

`datatable-mobile-modal` is a reusable helper that adds a mobile-friendly detail modal on top of jQuery DataTables.

It is compatible with DataTables `v1.13.x` and `v2.x` (jQuery integration) and supports:

- Mobile-only table transformation by breakpoint
- Row detail modal with grouped fields
- Column-level custom render functions
- Editable modal mode (text, number, email, select)
- Reactive fields and action callbacks
- Theme and z-index customization

## Installation

```bash
npm install @eswact/datatable-mobile-modal
```

## Peer dependencies

- `jquery` `>=3.6.0`
- `datatables.net` `>=1.13.7`

## Usage

```js
const DataTableMobileHelper = require('@eswact/datatable-mobile-modal');

const table = $('#customers').DataTable({
  data: mockData,
  columns: [
    { data: 'username', title: 'Username' },
    { data: 'company', title: 'Company' },
    { data: 'phone', title: 'Phone' },
    { data: 'email', title: 'Email' },
    { data: null, title: 'Process', render: () => 'Accept' }
  ]
});

const mobileHelper = new DataTableMobileHelper({
  table,
  modalTitle: 'Customer Details',
  primaryColumns: [0, 4],
  excludeColumns: [4],
  columnGroups: [
    { name: 'Contact', columns: [2, 3] }
  ],
  editableColumns: [
    { index: 2, type: 'text' },
    { index: 3, type: 'email' }
  ],
  onActionButtonClick: async (editedColumns) => {
    console.log(editedColumns);
    return true;
  }
});

// if needed:
// mobileHelper.destroy();
```

## Browser usage (CDN / direct script)

When loaded in browser with a script tag, it is available on `window`:

```js
const helper = new window.DataTableMobileHelper({
  table: $('#customers').DataTable(),
  primaryColumns: [0]
});
```

## Options

Main options accepted by `new DataTableMobileHelper(options)`:

- `table` (required): DataTables instance (`$('#table').DataTable()`)
- `primaryColumns`: columns visible on mobile
- `modalTitle`: modal header title
- `columnGroups`: grouped display in modal
- `excludeColumns`: columns excluded from modal
- `columnRenders`: custom render map by column index
- `mobileOnlyColumns`: columns visible only on mobile
- `editableMode`, `editableColumns`
- `reactiveFields`
- `onModalOpen`, `onActionButtonClick`
- `actionButtonHtml`, `detailButtonHtml`
- `theme`, `zindex`, `breakpoint`

## Notes

- The helper injects its own modal styles dynamically.
- jQuery (`$`) and DataTables must be loaded before creating the helper.
