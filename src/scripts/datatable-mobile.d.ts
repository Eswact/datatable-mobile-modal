export type DataTableColumnRender = (
  data: any,
  type: string,
  row: any,
  meta: { row: number; col: number }
) => any;

export interface DataTableMobileTheme {
  detailButtonColor?: string;
  modalCloseButtonColor?: string;
  modalBackgroundColor?: string;
  modalHeaderTitleColor?: string;
  modalHeaderBorderColor?: string;
  rowBorderColor?: string;
  rowTitleBackgroundColor?: string;
  actionButtonTextColor?: string;
  actionButtonBorderColor?: string;
  actionButtonBackgroundColor?: string;
}

export interface DataTableMobileGroup {
  name: string;
  columns: number[];
  isOpen?: boolean;
}

export interface EditableColumn {
  index: number;
  type: string;
  options?: Array<{ value: any; text: string }>;
  onKeydown?: (event: KeyboardEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onChange?: (event: Event) => void;
  displayResolver?: (value: any, rowData: any) => any;
}

export interface ReactiveField {
  sourceIndex: number | number[];
  targetIndex: number;
  calculate: (
    sourceValue: number,
    rowData: Record<number, any>,
    oldValue: number
  ) => any;
  onUpdate?: (
    sourceValue: number,
    newValue: any,
    allData: Record<number, any>,
    oldValue: number
  ) => void;
}

export interface DataTableMobileHelperOptions {
  table: any;
  primaryColumns?: number[];
  modalTitle?: string;
  columnGroups?: DataTableMobileGroup[] | null;
  excludeColumns?: number[];
  onModalOpen?: ((rowData: any, rowIndex: number) => void) | null;
  columnRenders?: Record<number, DataTableColumnRender>;
  mobileOnlyColumns?: number[];
  editableMode?: boolean;
  editableColumns?: EditableColumn[];
  onActionButtonClick?: ((editedColumns: Array<{ index: string; data: any }>) => Promise<boolean> | boolean) | null;
  actionButtonHtml?: string;
  reactiveFields?: ReactiveField[];
  breakpoint?: number;
  detailButtonHtml?: string;
  theme?: DataTableMobileTheme;
  zindex?: number;
}

export default class DataTableMobileHelper {
  constructor(options: DataTableMobileHelperOptions);
  destroy(): void;
}

