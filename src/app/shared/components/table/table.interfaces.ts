export enum CellType {
  LINK = 'LINK',
  DOUBLEDATA = 'DOUBLEDATA',
  ICON_TEXT = 'ICON_TEXT',
  STAR_RATE = 'STAR_RATE',
  ACTIONS = 'ACTIONS',
  IMAGES = 'IMAGES',
  HTML = 'HTML',
  AMOUNT = 'AMOUNT',
  RIGHT = 'RIGHT',
  ASYNC = 'ASYNC',
  CLICK = 'CLICK',
  DATE = 'DATE',
}

export type ColumnData = {
  label: string;
  type?: CellType;
  sortTable?: boolean;
  onlyDate?: boolean;
  showToggle?: boolean;
};

export type ColumnHeader = {
  [key: string]: ColumnData;
};

export type ActionEmitter = {
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  action: string;
};

export type Action = {
  name: string;
  color?: string;
  tooltip?: string;
  disabled?: boolean;
};
