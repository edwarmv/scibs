import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  mergeWith,
  Observable,
  of,
  skip as skipRxJS,
  startWith,
  Subject,
  switchMap,
  take as takeRxJS,
  takeUntil,
  tap,
} from 'rxjs';
import { DropdownItem } from './dropdown-item/dropdown-item.component';

export type DropdownDataSourceCb<T> = ({
  skip,
  take,
  term,
}: DropdownDataSourceCbParams) => Observable<{
  values: DropdownItem<T>[];
  total: number;
}>;

export type DropdownDataSourceCbParams = {
  skip: number;
  take: number;
  term: string;
};

export class DropdownDataSource<T> extends DataSource<DropdownItem<T>> {
  private total$ = new BehaviorSubject<number>(0);
  private pageSize = 10;
  private cachedData: DropdownItem<T>[] = [];
  private fetchedPages = new Set<number>();
  private dataStream$ = new BehaviorSubject<DropdownItem<T>[]>([]);

  private term$ = new BehaviorSubject<string>('');

  private unsubscribe$ = new Subject<void>();

  constructor(private cb: DropdownDataSourceCb<T>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<DropdownItem<T>[]> {
    of('')
      .pipe(mergeWith(this.term$.pipe(skipRxJS(1), debounceTime(200))))
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((term) => {
          this.fetchedPages.clear();
          return collectionViewer.viewChange.pipe(
            startWith(null),
            tap((listRange) => {
              if (listRange) {
                const startPage = this.getPageForIndex(listRange.start);
                const endPage = this.getPageForIndex(listRange.end - 1);
                for (let i = startPage; i <= endPage; i++) {
                  this.fetchPage(i, term);
                }
              } else {
                this.fetchPage(0, term);
              }
            })
          );
        })
      )
      .subscribe();
    return this.dataStream$;
  }

  getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  fetchPage(pageIndex: number, term: string) {
    if (this.fetchedPages.has(pageIndex)) {
      return;
    }
    this.fetchedPages.add(pageIndex);

    const skip = pageIndex * this.pageSize;
    const take = this.pageSize;

    this.cb({ skip, take, term })
      .pipe(
        takeRxJS(1),
        takeUntil(this.term$.pipe(combineLatestWith(this.total$), skipRxJS(1)))
      )
      .subscribe(({ values, total }) => {
        if (total !== 0 && total !== this.total$.value) {
          this.cachedData = Array.from({ length: total });
        } else if (total === 0) {
          this.cachedData = [];
        }
        this.total$.next(total);
        this.cachedData.splice(skip, take, ...values);
        this.dataStream$.next(this.cachedData);
      });
  }

  disconnect(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.cachedData = [];
    this.fetchedPages.clear();
  }

  set term(term: string) {
    this.term$.next(term);
  }
}
