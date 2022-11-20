import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { switchMap, take as TakeRxjs } from 'rxjs/operators';

export type TableDataSourceCbParams = {
  skip: number;
  take: number;
};

export type TableDataSourceCb<T> = ({
  skip,
  take,
}: TableDataSourceCbParams) => Observable<{
  values: T[];
  total: number;
}>;

export class TableDataSource<T> extends DataSource<T> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  private data$ = this.dataSubject.asObservable();
  private cbSubject = new ReplaySubject<TableDataSourceCb<T>>();
  private cb$ = this.cbSubject.asObservable();
  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
    return this.data$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.cbSubject.complete();
    this.totalSubject.complete();
  }

  fetchData({ skip, take }: TableDataSourceCbParams): void {
    this.cb$
      .pipe(
        TakeRxjs(1),
        switchMap((cb) => cb({ skip, take }))
      )
      .subscribe(({ values, total }) => {
        this.dataSubject.next(values);
        this.totalSubject.next(total);
      });
  }

  set cb(cb: TableDataSourceCb<T>) {
    if (cb) {
      this.cbSubject.next(cb);
    }
  }
}
