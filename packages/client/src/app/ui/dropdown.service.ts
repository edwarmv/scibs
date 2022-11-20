import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DropdownItem } from './dropdown/dropdown-item/dropdown-item.component';

@Injectable({
  providedIn: null,
})
export class DropdownService<T> {
  private _selectedItem$: Subject<DropdownItem<T>> = new Subject();
  selectedItem$ = this._selectedItem$.asObservable();

  constructor() {}

  set selectedItem(value: DropdownItem<T>) {
    this._selectedItem$.next(value);
  }
}
