import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PaginatorComponent } from './paginator/paginator.component';
import { TableDataSource, TableDataSourceCb } from './table.data-source';

export type Column<T> = {
  name: string;
  sortable?: boolean;
  type?: 'index';
  template?: TemplateRef<any>;
  formField?: {
    label: string;
    type: 'text' | 'number' | 'date';
    key: keyof T;
  };
};

type Sort = 'ASC' | 'DESC' | '';

type SortEvent = {
  columnName: string;
  sort: Sort;
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  dataSource: TableDataSource<T> = new TableDataSource();
  @Input()
  set fetchDataCb(cb: TableDataSourceCb<T>) {
    this.dataSource.cb = cb;
    this.dataSource.fetchData({
      skip: 0,
      take: this.pageSize ? this.pageSize : this.itemsPerPage[0],
    });
  }

  // paginator
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  itemsPerPage: number[] = [5, 10, 15];
  length: number;
  pageSize: number;
  pageIndex: number;

  @Input('columns')
  set _columns(columns: Column<T>[]) {
    this.columns = columns;
    this.columnNames = columns.map((value) => value.name);
  }
  columns: Column<T>[] = [];
  columnNames: string[] = [];
  activeColumn: number | null = null;

  @Output()
  sortChange = new EventEmitter<SortEvent>();
  sortIconArray: Sort[] = ['', 'ASC', 'DESC'];
  sortIconIndex = 0;

  @Output()
  onDblClickRow = new EventEmitter<T>()

  @Output()
  onBsRow = new EventEmitter<T>()

  constructor() {}

  ngAfterViewInit(): void {
    this.paginator.page$.subscribe((page) => {
      if (page) {
        this.pageIndex = page.pageIndex;
        this.pageSize = page.pageSize;
        this.dataSource.fetchData({
          skip: this.pageIndex * this.pageSize,
          take: this.pageSize,
        });
      }
    });
  }

  ngOnInit(): void {
    this.dataSource.total$.subscribe((total) => {
      this.length = total;
    });
  }

  value() {
    return 10;
  }

  onClickSort(columnIndex: number) {
    if (this.activeColumn === null || this.activeColumn === columnIndex) {
      if (this.sortIconIndex < 3) {
        this.sortIconIndex++;
      }
      if (this.sortIconIndex === 3) {
        this.sortIconIndex = 0;
      }
    } else {
      this.sortIconIndex = 1;
    }
    this.activeColumn = columnIndex;
    // this.sortChange.emit(sortEvent);
  }

  dblClickRow(element: T) {
    this.onDblClickRow.emit(element);
  }

  bsRow(element: T) {
    this.onBsRow.emit(element);
  }

  ngOnDestroy(): void {
    this.sortChange.complete();
  }
}
