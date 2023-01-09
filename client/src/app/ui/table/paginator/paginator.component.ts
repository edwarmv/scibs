import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DropdownItem } from '@ui/dropdown/dropdown-item/dropdown-item.component';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';

type PageEvent = {
  pageIndex: number;
  pageSize: number;
};

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input('itemsPerPage')
  set _itemsPerPage(items: number[]) {
    this.pageSizeSubject.next(items[0]);
    this.itemsPerPageSubject.next(
      items.map((item) => ({
        label: item.toString(),
        value: item,
      }))
    );
  }
  private itemsPerPageSubject = new BehaviorSubject<DropdownItem<number>[]>([]);
  private itemsPerPage$ = this.itemsPerPageSubject.asObservable();
  itemsPerPage: DropdownItem<number>[] = [];

  @Input('length')
  set _length(value: number) {
    this.lengthSubject.next(value);
  }
  private lengthSubject = new BehaviorSubject<number>(0);
  private length$ = this.lengthSubject.asObservable().pipe(
    tap((length) => {
      this.length = length;
    })
  );
  length = 0;

  pageSubject = new BehaviorSubject<PageEvent | undefined>(undefined);
  page$ = this.pageSubject.asObservable();

  pageSizeSubject = new BehaviorSubject<number>(0);
  pageSize$ = this.pageSizeSubject.asObservable().pipe(
    tap((pageSize) => {
      this.pageSize = pageSize;
    })
  );
  pageSize = 0;

  pageIndexSubject = new BehaviorSubject<number>(0);
  pageIndex$ = this.pageIndexSubject.asObservable().pipe(
    tap((pageIndex) => {
      this.pageIndex = pageIndex;
    })
  );
  pageIndex = 0;

  pageNumbers: number[][] = [[]];

  currentPageSection = 0;

  constructor() {}

  ngOnInit(): void {
    combineLatest([
      this.itemsPerPage$,
      this.length$,
      this.pageSize$,
      this.pageIndex$,
    ]).subscribe(([itemsPerPage, length, pageSize, pageIndex]) => {
      this.itemsPerPage = itemsPerPage;
      if (itemsPerPage.length && length && pageSize) {
        this.pageSubject.next({
          pageSize,
          pageIndex,
        });
        const sectionLength = Math.ceil(length / pageSize);
        const pageNumbers = Array.from(
          { length: sectionLength },
          (_, i) => i + 1
        );
        this.pageNumbers = Array.from(
          { length: Math.ceil(sectionLength / 5) },
          (_, i) => pageNumbers.slice(i * 5, (i + 1) * 5)
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.pageSubject.complete();
    this.lengthSubject.complete();
    this.itemsPerPageSubject.complete();
  }

  nextPage() {
    const lastPageNumber = this.lastPageNumber;
    if (this.pageIndex < lastPageNumber - 1) {
      this.pageIndex++;
    }

    const lastPageSectionNumber =
      this.pageNumbers[this.currentPageSection].slice(-1)[0];
    if (
      this.pageIndex === lastPageSectionNumber &&
      this.currentPageSection < this.pageNumbers.length
    ) {
      this.currentPageSection++;
    }
    if (this.pageNumbers.length > 0 && this.pageNumbers[0].length > 1) {
      this.pageSubject.next({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      });
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }

    const firstPageSectionNumber =
      this.pageNumbers[this.currentPageSection].slice(0)[0];
    if (
      this.pageIndex === firstPageSectionNumber - 1 &&
      this.currentPageSection > 0
    ) {
      this.currentPageSection--;
    }
    if (this.pageNumbers.length > 0 && this.pageNumbers[0].length > 1) {
      this.pageSubject.next({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      });
    }
  }

  nextPageBtnDisabled(): boolean {
    return this.pageIndex === this.lastPageNumber - 1;
  }

  prevPageBtnDisabled(): boolean {
    const firstPageSectionNumber =
      this.pageNumbers[this.currentPageSection].slice(0)[0];
    return this.pageIndex === firstPageSectionNumber - 1;
  }

  get lastPageNumber(): number {
    if (this.pageNumbers.length) {
      return this.pageNumbers.slice(-1)[0].slice(-1)[0];
    } else {
      return 1;
    }
  }
}
