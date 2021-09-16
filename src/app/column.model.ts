export interface IColumn {
  name: string;
  sortOrder: number;
  isChecked: boolean;
  isDisabled: boolean;
}

export class Column implements IColumn {
  public name: string;
  public sortOrder: number;
  public isChecked: boolean;
  public isDisabled: boolean;
}

export interface IOutputColumnFilter {
  actionName: string;
  columns: IColumn[];
}

export class OutputColumnFilter implements IOutputColumnFilter {
  public actionName: string;
  public columns: IColumn[];
}
