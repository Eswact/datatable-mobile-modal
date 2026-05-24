# datatable-responsive-modal

`datatable-responsive-modal` is a reusable helper that adds a mobile-friendly detail modal on top of jQuery DataTables.

It is compatible with DataTables `v1.13.x` and `v2.x` (jQuery integration) and supports:

- Mobile-only table transformation by breakpoint
- Row detail modal with grouped fields
- Column-level custom render functions
- Editable modal mode (text, number, email, select)
- Reactive fields and action callbacks
- Theme and z-index customization
- TypeScript definitions included

## Installation

```bash
npm install @eswact/datatable-responsive-modal
```

## Peer dependencies

- `jquery` `>=3.6.0`
- `datatables.net` `>=1.13.7`

## Usage

```js
const DataTableMobileHelper = require('@eswact/datatable-responsive-modal');

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
    return true; // return true to close the modal
  }
});

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

| Option | Default | Description |
|---|---|---|
| `table` | **required** | DataTables instance |
| `primaryColumns` | `[0]` | Column indexes visible on mobile |
| `modalTitle` | `'Details'` | Modal header title |
| `excludeColumns` | `[]` | Columns excluded from the modal |
| `columnGroups` | `null` | Group columns into collapsible sections — `{ name, columns, isOpen? }` |
| `columnRenders` | `{}` | Custom render functions per column index |
| `mobileOnlyColumns` | `[]` | Columns visible only on mobile, hidden on desktop |
| `editableMode` | `false` | Enable editable fields (auto-enabled when `editableColumns` is set) |
| `editableColumns` | `[]` | Editable column config — `{ index, type, options?, displayResolver?, onKeydown?, onBlur?, onChange? }` |
| `reactiveFields` | `[]` | Computed fields that update when a source field changes — `{ sourceIndex, targetIndex, calculate, onUpdate? }` |
| `onModalOpen` | `null` | `(rowData, rowIndex) => void` — fired when the modal opens |
| `onActionButtonClick` | `null` | `async (editedColumns) => boolean` — return `true` to close the modal |
| `actionButtonHtml` | `'Save'` | HTML content for the action button |
| `detailButtonHtml` | SVG icon | HTML content for the per-row detail button |
| `breakpoint` | `768` | Viewport width (px) below which mobile mode activates |
| `zindex` | `102` | CSS `z-index` of the modal |
| `theme` | Color overrides |


## Notes

- The helper injects its own modal styles dynamically.
- jQuery (`$`) and DataTables must be loaded before creating the helper.
- If `editableMode` is `true` but `editableColumns` is empty, all non-excluded columns become text inputs.
- The table transforms and restores automatically on window resize.
