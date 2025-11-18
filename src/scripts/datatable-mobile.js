/**
 * DataTable Mobile Modal - v1.13.7 Compatible
 * By Eswact
*/

class DataTableMobileHelper {
    constructor(options) {
        this.tableInstance = options.table; // DataTable instance
        this.primaryColumns = options.primaryColumns || [0]; // Showing columns on mobile
        this.modalTitle = options.modalTitle || 'Details';
        this.columnGroups = options.columnGroups || null; // [{ 'name': 'Group name', columns: [0,1,2] }, ... ]
        this.excludeColumns = options.excludeColumns || []; // Columns to exclude in modal
        this.onModalOpen = options.onModalOpen || null; // Callback when modal opens
        this.columnRenders = options.columnRenders || {}; // { columnIndex: function(data, type, row, meta) {...} }
        this.mobileOnlyColumns = options.mobileOnlyColumns || []; // [1,3,5] Mobile only columns (visible only on mobile, hidden on desktop)
        this.originalColumnVisibility = {}; // Store original column visibility for restoration

        this.breakpoint = options.breakpoint || 768;
        this.detailButtonHtml = `<button class="dtMobileDetailBtn">
            ${options.detailButtonHtml ||
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"/>
                </svg>`
            }
        </button>`;

        this.theme = Object.assign({
            detailButtonColor: '#2727a7',
            modalCloseButtonColor: '#df3f3f',
            modalBackgroundColor: '#f7f7f7',
            modalHeaderTitleColor: '#232323',
            modalHeaderBorderColor: '#23232323',
            rowBorderColor: '#dddddd',
            rowTitleBackgroundColor: '#f0f0f0',
        }, options.theme || {});

        this.isTransformed = false;

        this.init();
    }

    init() {
        // Store original visibility state before any transformations
        const settings = this.tableInstance.settings()[0];
        const columns = settings.aoColumns;
        $(columns).each((index, column) => {
            this.originalColumnVisibility[index] = this.tableInstance.column(index).visible();
        });

        if (this.isMobile()) {
            this.createModal();
            this.transformTable();
        }
        else {
            this.restoreTable();
        }

        // Resize event
        let resizeTimer;
        $(window).on('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (this.isMobile() && !this.isTransformed) {
                    this.createModal();
                    this.transformTable();
                } else if (!this.isMobile() && this.isTransformed) {
                    this.restoreTable();
                }
            }, 250);
        });
    }

    isMobile() {
        return window.innerWidth <= this.breakpoint;
    }

    // Transform table to mobile view
    transformTable() {
        const settings = this.tableInstance.settings()[0];
        const columns = settings.aoColumns;

        $(columns).each((index, column) => {
            // Show mobile-only columns
            if (this.mobileOnlyColumns.includes(index)) {
                this.tableInstance.column(index).visible(true);
            }
            // Hide non-primary columns
            else if (!this.primaryColumns.includes(index)) {
                this.tableInstance.column(index).visible(false);
            }
        });

        this.addDetailButtons();

        this.isTransformed = true;
    }

    addDetailButtons() {
        const primaryIdx = this.primaryColumns[0];
        const that = this;

        // Visible cells
        const nodes = this.tableInstance.column(primaryIdx, { page: 'current' }).nodes();

        $(nodes).each(function (i, cell) {
            if ($(cell).find('.dtMobileDetailBtn').length === 0) {
                $(cell).html(
                    `<div class="dtMobileCellWrapper">
                        ${that.detailButtonHtml}
                        ${$(cell).html()}
                    </div>`
                );
            }
        });

        $('.dtMobileDetailBtn').off('click').on('click', function (e) {
            const rowIndex = that.tableInstance.row($(this).closest('tr')).index();
            const rowData = that.tableInstance.row(rowIndex).data();
            that.showModal(rowData, rowIndex);
        });
    }

    restoreTable() {
        const settings = this.tableInstance.settings()[0];
        const columns = settings.aoColumns;

        // Restore original visibility state
        $(columns).each((index, column) => {
            // Hide mobile-only columns on desktop
            if (this.mobileOnlyColumns.includes(index)) {
                this.tableInstance.column(index).visible(false);
            }
            // Restore other columns to their original state
            else if (this.originalColumnVisibility.hasOwnProperty(index)) {
                this.tableInstance.column(index).visible(this.originalColumnVisibility[index]);
            }
        });

        // Remove detail buttons
        const primaryIdx = this.primaryColumns[0];
        const nodes = this.tableInstance.column(primaryIdx, { page: 'current' }).nodes();

        $(nodes).each(function (i, cell) {
            const $cell = $(cell);
            const $wrapper = $cell.find('.dtMobileCellWrapper');

            if ($wrapper.length > 0) {
                const originalContent = $wrapper.contents().filter(function () {
                    return !$(this).hasClass('dtMobileDetailBtn');
                });
                $cell.html(originalContent);
            }
        });

        // Remove modal & styles if exists
        $('#dtMobileModal').remove();
        $('#dtMobileHelperStyles').remove();

        this.isTransformed = false;
    }

    // Show modal & generate content
    showModal(rowData, rowIndex) {
        $('#dtMobileModal').addClass('show');
        this.generateModalContent(rowData, rowIndex);

        if (this.onModalOpen && typeof this.onModalOpen === 'function') {
            this.onModalOpen(rowData, rowIndex);
        }
    }

    // Render column data with custom render function
    renderColumnData(data, columnIndex, rowData, rowIndex) {
        // Check if there's a custom render function for this column
        if (this.columnRenders[columnIndex] && typeof this.columnRenders[columnIndex] === 'function') {
            return this.columnRenders[columnIndex](data, 'display', rowData, {
                row: rowIndex,
                col: columnIndex
            });
        }

        // Return raw data if no render function
        return data;
    }

    generateModalContent(rowData, rowIndex) {
        const settings = this.tableInstance.settings()[0];
        const columns = settings.aoColumns;

        const modalContent = $('#dtMobileModal .dtMobileModalContent');
        modalContent.empty();

        // Grouped content
        let groupedColumnIndexes = [];
        if (this.columnGroups) {
            this.columnGroups.forEach(group => {
                groupedColumnIndexes = groupedColumnIndexes.concat(group.columns);
            });

            columns.forEach((column, index) => {
                if (!this.excludeColumns.includes(index) && !groupedColumnIndexes.includes(column.idx)) {
                    const renderedData = this.renderColumnData(rowData[column.data], column.idx, rowData, rowIndex);
                    const simpleContent = this.generateSimpleContent(renderedData, column.sTitle);
                    modalContent.append(simpleContent);
                }
            });

            this.columnGroups.forEach(group => {
                const groupRowData = group.columns.map((colIdx) => {
                    const col = columns.find(column => column.idx === colIdx);
                    const renderedData = this.renderColumnData(rowData[col.data], col.idx, rowData, rowIndex);
                    return {
                        idx: colIdx,
                        data: renderedData,
                        name: col.sTitle
                    };
                });
                const groupContent = this.generateGroupedContent(groupRowData, group.columns, group.name);
                modalContent.append(groupContent);
            });

            // Grouped content acordion functionality
            $('.dtMobileModalGroupTitle').off('click').on('click', function () {
                $(this).next('.dtMobileModalGroupContent').slideToggle();
            });
        }
        else {
            columns.forEach((column, index) => {
                if (!this.excludeColumns.includes(index)) {
                    const renderedData = this.renderColumnData(rowData[column.data], column.idx, rowData, rowIndex);
                    const simpleContent = this.generateSimpleContent(renderedData, column.sTitle);
                    modalContent.append(simpleContent);
                }
            });
        }
    }

    generateSimpleContent(data, title) {
        return `<div class="dtMobileModalRow">
            <div class="dtMobileModalRowTitle">${title}</div>
            <div class="dtMobileModalRowValue">${data}</div>
        </div>`;
    }

    generateGroupedContent(datas, columns, title) {
        return `<div class="dtMobileModalGroup">
            <div class="dtMobileModalGroupTitle">
                <h3>${title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z"/></svg>
            </div>
            <div class="dtMobileModalGroupContent" style="display: none;">
                ${datas.map(dataObj => {
            return `<div class="dtGroupContentRow">
                            <div>${dataObj.name}</div>
                            <div>${dataObj.data}</div>
                        </div>`;
        }).join('')
            }
            </div>
        </div>`;
    }

    // Create modal HTML
    createModal() {
        if ($('#dtMobileModal').length > 0) return;

        const modalHtml = `<div id="dtMobileModal">
            <div class="dtMobileModalHeader">
                <h2 class="dtMobileModalTitle">${this.modalTitle}</h2>
                <button class="dtMobileModalCloseBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/>
                    </svg>
                </button>
            </div>
            <div class="dtMobileModalContent">
                <!-- Dynamic Content Here -->
            </div>
        </div>`;
        $('body').append(modalHtml);

        // Close button event
        $('.dtMobileModalCloseBtn').off('click').on('click', () => {
            $('#dtMobileModal').removeClass('show');
        });

        this.injectStyles();
    }

    // Inject mobile datatable styles
    injectStyles() {
        if ($('#dtMobileHelperStyles').length > 0) return;

        const styles = `<style id="dtMobileHelperStyles">
            .dtMobileCellWrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .dtMobileDetailBtn {
                background: none;
                border: none;
                cursor: pointer;
                width: 2.25rem;
                padding: 0.25rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                fill: ${this.theme.detailButtonColor};
            }
            #dtMobileModal {
                z-index: 100;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 1rem;
                background-color: ${this.theme.modalBackgroundColor};
                display: none;
                flex-direction: column;
                overflow-y: auto;
            }
            #dtMobileModal.show {
                display: flex;
            }
            .dtMobileModalHeader {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 0.25rem;
                border-bottom: 1px solid ${this.theme.modalHeaderBorderColor};
            }
            .dtMobileModalTitle {
                font-size: 1.25rem;
                font-weight: 700;
                color: ${this.theme.modalHeaderTitleColor};
            }
            .dtMobileModalCloseBtn {
                background: none;
                border: none;
                cursor: pointer;
                width: 2.25rem;
                padding: 0.25rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                fill: ${this.theme.modalCloseButtonColor};
            }
            .dtMobileModalContent {
                padding: 1rem 0.25rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .dtMobileModalRow {
                width: 100%;
                display: flex;
                flex-direction: column;
                border-radius: 0.5rem;
                overflow: hidden;
                border: 2px solid ${this.theme.rowBorderColor};
            }
            .dtMobileModalRow .dtMobileModalRowTitle {
                padding: 0.5rem;
                background-color: ${this.theme.rowTitleBackgroundColor};
                font-weight: 600;
                border-bottom: 1px solid ${this.theme.rowBorderColor};
            }
            .dtMobileModalRow .dtMobileModalRowValue {
                padding: 0.5rem;
                font-size: 0.875rem;
            }
            .dtMobileModalGroup {
                display: flex;
                flex-direction: column;
                border-radius: 0.5rem;
                overflow: hidden;
                border: 2px solid ${this.theme.rowBorderColor};
            }
            .dtMobileModalGroupTitle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.5rem;
                padding: 0.5rem;
                background-color: ${this.theme.rowTitleBackgroundColor};
                border-bottom: 1px solid ${this.theme.rowBorderColor};
                cursor: pointer;
            }
            .dtMobileModalGroupTitle h3 {
                font-size: 1rem;
                font-weight: 600;
            }
            .dtMobileModalGroupTitle svg {
                width: 1.5rem;
                transition: transform 0.3s ease;
            }
            .dtMobileModalGroupTitle.active svg {
                transform: rotate(180deg);
            }
            .dtMobileModalGroupContent {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding: 0.5rem;
            }
            .dtMobileModalGroupContent .dtGroupContentRow {
                display: flex;
                flex-direction: column;
                padding: 0.5rem 0;
                border-bottom: 1px solid ${this.theme.rowBorderColor};
                font-size: 0.875rem;
            }
            .dtMobileModalGroupContent .dtGroupContentRow:last-child {
                border-bottom: none;
            }
            .dtMobileModalGroupContent .dtGroupContentRow div:first-child {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
        </style>`;
        $('head').append(styles);
    }
}

// Global usage
window.DataTableMobileHelper = DataTableMobileHelper;